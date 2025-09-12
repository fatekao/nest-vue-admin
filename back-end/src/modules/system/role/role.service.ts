import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, RolePageQueryDto } from './dto/req-role.dto';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { RedisService } from '@/shared/redis/redis.service';
import { CacheKeyBuilder } from '@/common/utils/query.util';
import { CACHE_TTL } from '@/common/constants/cache.constant';
import { MESSAGES } from '@/common/constants/message.constant';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto) {
    // 从createRoleDto中排除关系字段
    const { createBy, updateBy, ...roleData } = createRoleDto;

    const role = await this.prisma.sysRole.create({
      data: {
        ...roleData,
        creator: {
          connect: { id: createBy },
        },
        updater: {
          connect: { id: updateBy },
        },
      },
    });
    return role;
  }

  /**
   * 查询所有角色（用于下拉选择）
   */
  async findAll() {
    return await this.prisma.sysRole.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createTime: 'desc',
      },
    });
  }

  /**
   * 分页查询角色列表
   */
  async findPage(query: RolePageQueryDto) {
    const { keyword, status, page = 1, pageSize = 10 } = query;

    const where: Record<string, any> = {
      isDeleted: false,
    };

    if (keyword) {
      where.OR = [{ name: { contains: keyword } }, { key: { contains: keyword } }];
    }

    if (status !== undefined) {
      where.status = status;
    }

    const skip = (page - 1) * pageSize;
    const [roles, total] = await Promise.all([
      this.prisma.sysRole.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createTime: 'desc',
        },
      }),
      this.prisma.sysRole.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      list: roles,
      total,
      totalPages,
      page,
      pageSize,
    };
  }

  /**
   * 根据ID查找角色
   */
  async findOne(id: number) {
    const cacheKey = CacheKeyBuilder.roleKey(id);

    // 尝试从缓存获取
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const role = await this.prisma.sysRole.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!role) {
      throw new NotFoundException(MESSAGES.ROLE_NOT_FOUND);
    }

    // 设置缓存
    await this.redis.set(cacheKey, role, CACHE_TTL.MEDIUM);

    return role;
  }

  /**
   * 更新角色
   */
  async update(updateRoleDto: UpdateRoleDto) {
    const { id, ...updateData } = updateRoleDto;

    // 检查角色是否存在
    const existingRole = await this.prisma.sysRole.findUnique({
      where: { id, isDeleted: false },
    });

    if (!existingRole) {
      throw new NotFoundException(MESSAGES.ROLE_NOT_FOUND);
    }

    // 检查是否有用户关联此角色
    const userCount = await this.prisma.sysUser.count({
      where: {
        roles: {
          some: {
            id,
          },
        },
      },
    });

    if (userCount > 0) {
      throw new ConflictException(MESSAGES.ROLE_IN_USE);
    }

    const role = await this.prisma.sysRole.update({
      where: { id },
      data: updateData,
    });

    // 清除缓存
    const cacheKey = CacheKeyBuilder.roleKey(id);
    await this.redis.del(cacheKey);

    return role;
  }

  /**
   * 删除角色（软删除）
   */
  async remove(id: number) {
    // 检查角色是否存在
    const existingRole = await this.prisma.sysRole.findUnique({
      where: { id, isDeleted: false },
    });

    if (!existingRole) {
      throw new NotFoundException(MESSAGES.ROLE_NOT_FOUND);
    }

    // 检查是否有用户关联此角色
    const userCount = await this.prisma.sysUser.count({
      where: {
        roles: {
          some: {
            id,
          },
        },
      },
    });

    if (userCount > 0) {
      throw new ConflictException(MESSAGES.ROLE_IN_USE);
    }

    const result = await this.prisma.sysRole.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    // 清除缓存
    const cacheKey = CacheKeyBuilder.roleKey(id);
    await this.redis.del(cacheKey);

    return result;
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, RolePageQueryDto } from './dto/req-role.dto';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { RedisService } from '@/shared/redis/redis.service';
import { CacheKeyBuilder } from '@/common/utils/query.util';
import { CACHE_TTL } from '@/common/constants/cache.constant';
import { MESSAGES } from '@/common/constants/message.constant';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    try {
      const role = await this.prisma.sysRole.create({
        data: createRoleDto,
      });
      return role;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const targetField = error.meta?.target;
        let message = '该信息已存在';
        if (typeof targetField === 'string') {
          if (targetField.includes('name')) {
            message = '角色名称已存在';
          } else if (targetField.includes('key')) {
            message = '角色标识已存在';
          }
        }
        throw new ConflictException(message);
      }
      throw error;
    }
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
        include: {
          _count: {
            select: {
              users: {
                where: { isDeleted: false },
              },
            },
          },
        },
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
   * 获取所有角色列表（用于下拉选择）
   */
  async findAll() {
    const roles = await this.prisma.sysRole.findMany({
      where: {
        isDeleted: false,
        status: 0, // 只返回正常状态的角色
      },
      select: {
        id: true,
        name: true,
        key: true,
        status: true,
      },
      orderBy: {
        createTime: 'desc',
      },
    });

    return roles;
  }

  /**
   * 根据ID查找角色（带缓存）
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
  async update(updateRoleDto: UpdateRoleDto, updateBy?: number) {
    const { id, ...updateData } = updateRoleDto;

    try {
      const role = await this.prisma.sysRole.update({
        where: { id },
        data: {
          ...updateData,
          updateTime: new Date(),
          ...(updateBy && { updateBy }),
        },
      });

      // 清除缓存
      const cacheKey = CacheKeyBuilder.roleKey(id);
      await this.redis.del(cacheKey);

      return role;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const targetField = error.meta?.target;
        let message = '该信息已存在';
        if (typeof targetField === 'string') {
          if (targetField.includes('name')) {
            message = '角色名称已存在';
          } else if (targetField.includes('key')) {
            message = '角色标识已存在';
          }
        }
        throw new ConflictException(message);
      }
      throw error;
    }
  }

  /**
   * 删除角色（软删除）
   */
  async remove(id: number, updateBy?: number) {
    // 检查角色是否存在
    const role = await this.prisma.sysRole.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException(MESSAGES.ROLE_NOT_FOUND);
    }

    // 检查角色是否正在被使用
    const userCount = await this.prisma.sysUser.count({
      where: {
        roles: {
          some: {
            id,
          },
        },
        isDeleted: false,
      },
    });

    if (userCount > 0) {
      throw new ConflictException(MESSAGES.ROLE_IN_USE);
    }

    const result = await this.prisma.sysRole.update({
      where: { id },
      data: {
        isDeleted: true,
        updateTime: new Date(),
        ...(updateBy && { updateBy }),
      },
    });

    // 清除缓存
    const cacheKey = CacheKeyBuilder.roleKey(id);
    await this.redis.del(cacheKey);

    return result;
  }

  /**
   * 为角色分配权限
   */
  async setPermissions(roleId: number, permissionIds: number[], updateBy?: number) {
    const role = await this.prisma.sysRole.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(MESSAGES.ROLE_NOT_FOUND);
    }

    // 使用 set 操作直接替换所有权限关联
    await this.prisma.sysRole.update({
      where: { id: roleId },
      data: {
        permissions: {
          set: permissionIds.map((permissionId) => ({ id: permissionId })),
        },
        updateTime: new Date(),
        ...(updateBy && { updateBy }),
      },
    });

    // 清除缓存
    const cacheKey = CacheKeyBuilder.roleKey(roleId);
    await this.redis.del(cacheKey);

    return MESSAGES.SUCCESS;
  }
}

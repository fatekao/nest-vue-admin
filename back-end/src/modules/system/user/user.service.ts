import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserPageRequeryDto } from './dto/req-user.dto';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { RedisService } from '@/shared/redis/redis.service';
import { CacheKeyBuilder } from '@/common/utils/query.util';
import { DataTransformer } from '@/common/utils/response.util';
import { CACHE_TTL } from '@/common/constants/cache.constant';
import { MESSAGES } from '@/common/constants/message.constant';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto, createBy?: number) {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userData = {
      ...createUserDto,
      password: hashedPassword,
      ...(createBy && { createBy, updateBy: createBy }),
    };

    try {
      const user = await this.prisma.sysUser.create({
        data: userData,
      });

      // 返回时移除密码字段
      return DataTransformer.formatUser(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const targetField = error.meta?.target;
        let message = '该信息已被注册';
        if (typeof targetField === 'string') {
          if (targetField.includes('username')) {
            message = MESSAGES.USERNAME_EXISTS;
          } else if (targetField.includes('email')) {
            message = MESSAGES.EMAIL_EXISTS;
          } else if (targetField.includes('phone')) {
            message = MESSAGES.PHONE_EXISTS;
          }
        }
        throw new ConflictException(message);
      }
      throw error;
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(id: number, updateBy?: number) {
    const user = await this.prisma.sysUser.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash('Pw123456', salt);

    await this.prisma.sysUser.update({
      where: { id },
      data: {
        password: hashedPassword,
        updateTime: new Date(),
        ...(updateBy && { updateBy }),
      },
    });

    // 清除用户缓存
    const cacheKey = CacheKeyBuilder.userKey(id);
    await this.redis.del(cacheKey);
    return MESSAGES.PASSWORD_RESET_SUCCESS;
  }

  /**
   * 修改密码
   */
  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.prisma.sysUser.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.OLD_PASSWORD_INCORRECT);
    }

    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.sysUser.update({
      where: { id },
      data: {
        password: hashedPassword,
        updateTime: new Date(),
      },
    });

    const cacheKey = CacheKeyBuilder.userKey(id);
    await this.redis.del(cacheKey);
    return MESSAGES.PASSWORD_UPDATE_SUCCESS;
  }

  /**
   * 分页查询用户
   */
  async findPage(query: UserPageRequeryDto) {
    const { username, roleId, page = 1, pageSize = 10 } = query;

    const where: Record<string, any> = {
      isDeleted: false,
    };

    if (username) {
      where.username = {
        contains: username,
      };
    }

    if (roleId) {
      where.roles = {
        some: {
          id: roleId,
          isDeleted: false,
        },
      };
    }

    const skip = (page - 1) * pageSize;
    const [users, total] = await Promise.all([
      this.prisma.sysUser.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          roles: {
            where: { isDeleted: false, status: 0 },
            select: {
              id: true,
              name: true,
              key: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.sysUser.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      list: DataTransformer.formatUserList(users),
      pagination: {
        total,
        totalPages,
        page,
        pageSize,
      },
    };
  }

  /**
   * 根据ID查找用户（带缓存）
   */
  async findOne(id: number) {
    const cacheKey = CacheKeyBuilder.userKey(id);

    // 尝试从缓存获取
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.prisma.sysUser.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        roles: {
          where: { isDeleted: false, status: 0 },
          select: {
            id: true,
            name: true,
            key: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    const formattedUser = DataTransformer.formatUser(user);

    // 设置缓存
    await this.redis.set(cacheKey, formattedUser, CACHE_TTL.MEDIUM);

    return formattedUser;
  }

  /**
   * 根据用户名查找用户
   */
  async findOneByUsername(username: string) {
    return await this.prisma.sysUser.findFirst({
      where: {
        username,
        isDeleted: false,
      },
    });
  }

  /**
   * 更新用户
   */
  async update(updateUserDto: UpdateUserDto, updateBy?: number) {
    const { id, ...updateData } = updateUserDto;

    try {
      const user = await this.prisma.sysUser.update({
        where: { id },
        data: {
          ...updateData,
          updateTime: new Date(),
          ...(updateBy && { updateBy }),
        },
      });

      // 清除缓存
      const cacheKey = CacheKeyBuilder.userKey(id);
      await this.redis.del(cacheKey);

      return DataTransformer.formatUser(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(MESSAGES.EMAIL_EXISTS);
      }
      throw error;
    }
  }

  /**
   * 删除用户（软删除）
   */
  async remove(id: number, updateBy?: number) {
    const result = await this.prisma.sysUser.update({
      where: { id },
      data: {
        isDeleted: true,
        updateTime: new Date(),
        ...(updateBy && { updateBy }),
      },
    });

    const cacheKey = CacheKeyBuilder.userKey(id);
    await this.redis.del(cacheKey);

    return result;
  }
}

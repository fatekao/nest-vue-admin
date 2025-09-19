import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserPageRequeryDto } from './dto/req-user.dto';
import { UserInfoCreateResDto, UserInfoResDto, UserInfoWithNameResDto } from './dto/res-user.dto';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { RedisService } from '@/shared/redis/redis.service';
import { CacheKeyBuilder } from '@/common/utils/query.util';
import { DataTransformer } from '@/common/utils/response.util';
import { CACHE_TTL } from '@/common/constants/cache.constant';
import { MESSAGES } from '@/common/constants/message.constant';
import { PaginationResDto } from '@/common/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;
  private readonly DEFAULT_TEMP_PASSWORD_LENGTH = 8;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * 生成临时密码
   * 格式：大写字母 + 小写字母 + 数字 + 特殊字符
   */
  private generateTempPassword(length: number = this.DEFAULT_TEMP_PASSWORD_LENGTH): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    // 确保密码包含所有类型的字符
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // 填充剩余位数
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // 随机打乱密码
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto): Promise<UserInfoCreateResDto> {
    // 系统自动生成临时密码
    const tempPassword = this.generateTempPassword();

    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // 从createUserDto中排除关系字段
    const { createBy, updateBy: _updateBy, ...userData } = createUserDto;

    const user = await this.prisma.sysUser.create({
      data: {
        ...userData,
        password: hashedPassword,
        creator: {
          connect: { id: createBy },
        },
        updater: {
          connect: { id: createBy },
        },
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

    const { password: _password, ...userInfo } = user;

    return {
      ...userInfo,
      tempPassword,
      isTemporaryPassword: true, // 标记这是临时密码
    };
  }

  /**
   * 更新用户
   */
  async update(updateUserDto: UpdateUserDto): Promise<UserInfoResDto> {
    const { id, updateBy, createBy: _createBy, ...updateData } = updateUserDto;

    const user = await this.prisma.sysUser.update({
      where: { id },
      data: {
        ...updateData,
        updater: {
          connect: { id: updateBy },
        },
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

    // 清除缓存
    const cacheKey = CacheKeyBuilder.userKey(id);
    await this.redis.del(cacheKey);

    const { password: _password, ...userInfo } = user;

    return userInfo;
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
   * 分页查询用户
   */
  async findPage(query: UserPageRequeryDto): Promise<PaginationResDto<UserInfoWithNameResDto>> {
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
          creator: {
            select: { nickName: true },
          },
          updater: {
            select: { nickName: true },
          },
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

    return {
      list: plainToInstance(UserInfoWithNameResDto, users),
      total,
      page,
      pageSize,
    };
  }

  /**
   * 重置密码
   */
  async resetPassword(id: number) {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash('Pw123456', salt);

    await this.prisma.sysUser.update({
      where: { id },
      data: {
        password: hashedPassword,
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
      },
    });

    const cacheKey = CacheKeyBuilder.userKey(id);
    await this.redis.del(cacheKey);
    return MESSAGES.PASSWORD_UPDATE_SUCCESS;
  }

  /**
   * 删除用户（软删除）
   */
  async remove(id: number) {
    const result = await this.prisma.sysUser.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    const cacheKey = CacheKeyBuilder.userKey(id);
    await this.redis.del(cacheKey);

    return result;
  }

  /**
   * 用户关联角色
   */
  async relateRoles(id: number, roleIds: number[]) {
    await this.prisma.sysUser.update({
      where: { id },
      data: {
        roles: {
          set: roleIds.map((roleId) => ({ id: roleId })),
        },
      },
    });
  }
}

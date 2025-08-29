import { Body, Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserPageRequeryDto } from './dto/req-user.dto';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { RedisService } from '@/shared/redis/redis.service';

import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10; // bcrypt 加密的盐轮数

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    try {
      return await this.prisma.sysUser.create({
        data: userData,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const targetField = error.meta?.target;

        let message = '该信息已被注册';
        if (typeof targetField === 'string') {
          if (targetField.includes('username')) {
            message = '用户名已被注册';
          } else if (targetField.includes('email')) {
            message = '邮箱已被注册';
          } else if (targetField.includes('phone')) {
            message = '手机号已被注册';
          }
        }
        throw new ConflictException(message);
      }
      throw error;
    }
  }

  async resetPassword(id: number) {
    const user = await this.prisma.sysUser.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash('Pw123456', salt);

    await this.prisma.sysUser.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
    const cacheKey = `user:${id}`;
    await this.redis.del(cacheKey); // 删除缓存
    return '密码已更新';
  }

  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.prisma.sysUser.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('旧密码不正确');
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

    const cacheKey = `user:${id}`;
    await this.redis.del(cacheKey);
    return true;
  }

  async findPage(query: UserPageRequeryDto) {
    const { username, roleId, page, pageSize } = query;
    const where: {
      isDeleted?: boolean;
      username?: {
        contains: string;
      };
      roleId?: number;
    } = {
      isDeleted: false,
    };
    if (username) {
      where.username = {
        contains: username,
      };
    }
    if (roleId) {
      where.roleId = roleId;
    }

    const skip = (page - 1) * pageSize;
    const [users, total] = await Promise.all([
      this.prisma.sysUser.findMany({
        where,
        skip,
        take: pageSize,
      }),
      this.prisma.sysUser.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return {
      list: users.map((item) => ({ ...item, password: undefined })),
      pagination: {
        total,
        totalPages,
        page: query.page,
        pageSize: query.pageSize,
      },
    };
  }

  async findOne(id: number) {
    const cacheKey = `user:${id}`;
    const cacheUser = await this.redis.get(cacheKey);
    if (cacheUser) {
      return cacheUser;
    }

    const user = await this.prisma.sysUser.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findOneByUsername(username: string) {
    return await this.prisma.sysUser.findFirst({
      where: {
        username,
        isDeleted: false,
      },
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...updateData } = updateUserDto;

    try {
      return await this.prisma.sysUser.update({
        where: {
          id,
        },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('邮箱已被注册');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.sysUser.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}

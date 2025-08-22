import { Body, Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserPageRequeryDto } from './dto/req-user.dto';
import { CreatePipe } from '@/common/pipes/create.pipe';

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
  async create(@Body(CreatePipe) createUserDto: CreateUserDto) {
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
        throw new ConflictException('邮箱已被注册');
      }
      throw error;
    }
  }

  async setPassword(userId: number, newPassword: string) {
    const user = await this.prisma.sysUser.findUnique({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.sysUser.update({
      where: {
        userId,
      },
      data: {
        password: hashedPassword,
        updateTime: new Date(),
      },
    });
    const cacheKey = `user:${userId}`;
    await this.redis.del(cacheKey); // 删除缓存
    return { message: '密码已更新' };
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.prisma.sysUser.findUnique({ where: { userId } });
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
      where: { userId },
      data: {
        password: hashedPassword,
        updateTime: new Date(),
      },
    });

    const cacheKey = `user:${userId}`;
    await this.redis.del(cacheKey);
    return true;
  }

  async findPage(query: UserPageRequeryDto) {
    console.log('######query######', query);
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

  async findOne(userId: number) {
    const cacheKey = `user:${userId}`;
    const cacheUser = await this.redis.get(cacheKey);
    if (cacheUser) {
      return cacheUser;
    }

    const user = await this.prisma.sysUser.findUnique({
      where: {
        userId,
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
    const { userId, ...updateData } = updateUserDto;
    
    try {
      return await this.prisma.sysUser.update({
        where: {
          userId,
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

  remove(userId: number) {
    return this.prisma.sysUser.update({
      where: {
        userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}

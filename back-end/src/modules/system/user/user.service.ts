import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/req-user.dto';

import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/modules/common/redis/redis.service';

import * as bcrypt from 'bcrypt';

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

    return this.prisma.sysUser.create({
      data: userData,
    });
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

    const cacheKey = `user: ${userId}`;
    await this.redis.del(cacheKey);
    return true;
  }

  async findAll() {
    const user = await this.prisma.sysUser.findMany({
      where: { isDeleted: false },
      orderBy: { userId: 'asc' },
    });
    return user;
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

  update(updateUserDto: UpdateUserDto) {
    const { userId, ...updateData } = updateUserDto;
    console.log('updateData', updateData);
    return this.prisma.sysUser.update({
      where: {
        userId,
      },
      data: updateData,
    });
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

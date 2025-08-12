import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/modules/common/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/req-auth.dto';
import { User } from '@/modules/system/user/entities/user.entity';

/**
 * 认证服务类
 * 处理用户身份验证、token生成和验证等相关功能
 */
@Injectable()
export class AuthService {
  /**
   * 构造函数
   * @param prisma - Prisma数据库服务
   * @param redis - Redis缓存服务
   * @param jwtService - JWT服务
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * 验证用户身份
   * 根据用户名和密码验证用户是否存在且有效
   * @param username - 用户名
   * @param password - 密码
   * @returns Promise<User> - 验证成功的用户信息
   * @throws UnauthorizedException - 当用户不存在、密码错误或用户状态异常时抛出
   */
  async validateUser(username: string, password: string): Promise<User> {
    // 查询用户信息，确保用户未被删除且处于激活状态
    const user = await this.prisma.sysUser.findUnique({
      where: {
        username,
        isDeleted: false, // 确保用户未被删除
        status: 1, // 确保用户处于激活状态
      },
    });

    // 用户不存在时抛出异常
    if (!user) throw new UnauthorizedException('用户不存在');
    // 用户密码未设置时抛出异常
    if (!user.password) throw new UnauthorizedException('用户密码未设置');

    // 验证密码是否匹配
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('用户名或密码错误');
    return user;
  }

  /**
   * 用户登录处理
   * 生成JWT token并存储到Redis中
   * @param loginDto - 登录数据传输对象
   * @param user - 已验证的用户信息
   * @returns Promise<{ accessToken: string }> - 包含访问令牌的响应对象
   */
  async login(loginDto: LoginDto, user: User): Promise<{ accessToken: string }> {
    const { username } = loginDto;

    // 构造JWT payload数据
    const payload = {
      username,
      userId: user.userId,
    };

    // 生成JWT token，设置7天过期时间
    const token = this.jwt.sign(payload, { expiresIn: '7d' });

    // 将token存入Redis，过期时间与JWT同步（7天）
    await this.redis.set(`${payload.username}&${payload.userId}`, `Bearer ${token}`, 60 * 60 * 24 * 7); // 7天过期
    return { accessToken: token };
  }

  /**
   * 用户登出处理
   * 从Redis中删除用户的token
   * @param username - 用户名
   * @returns Promise<void>
   */
  async signOut(username: string): Promise<void> {
    await this.redis.del(username);
  }

  /**
   * 根据用户ID获取用户信息
   * 用于已通过JWT验证后获取用户详细信息
   * @param userId - 用户ID
   * @returns Promise<User | null> - 用户信息或null
   * @throws UnauthorizedException - 当用户不存在或状态异常时抛出
   */
  async getUserInfo(userId: number): Promise<User | null> {
    try {
      // 获取用户信息，确保用户未被删除且处于激活状态
      const user = await this.prisma.sysUser.findUnique({
        where: { userId },
        include: {
          roles: {
            where: { isDeleted: false, status: 0 }, // 确保角色未被删除
            include: {
              menus: {
                where: { isDeleted: false }, // 确保菜单未被删除
                orderBy: { orderNum: 'asc' },
              },
            },
          },
        },
      });

      // 用户不存在时抛出异常
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      const userInfo = {
        ...user,
        buttons: [],
      };
      return userInfo;
    } catch (error: any) {
      console.error('Get user info error:', error);
      throw error;
    }
  }
}

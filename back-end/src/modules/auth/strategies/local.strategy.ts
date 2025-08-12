import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@/modules/system/user/entities/user.entity';

/**
 * 本地认证策略
 * 使用用户名和密码进行身份验证
 * 继承自 PassportStrategy(Strategy)，实现 Passport 的本地策略
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * 构造函数
   * @param authService - 认证服务，用于验证用户凭证
   */
  constructor(private readonly authService: AuthService) {
    // 调用父类构造函数，初始化 Passport 策略
    super();
  }

  /**
   * 验证函数
   * 由 Passport 调用以验证用户名和密码
   * @param username - 用户名
   * @param password - 密码
   * @returns Promise<User> - 验证成功的用户信息
   * @throws UnauthorizedException - 当用户名或密码错误时抛出
   */
  async validate(username: string, password: string): Promise<User> {
    // 调用认证服务验证用户凭证
    const user = await this.authService.validateUser(username, password);

    // 如果用户不存在或凭证无效，抛出未授权异常
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 返回验证成功的用户信息
    return user;
  }
}

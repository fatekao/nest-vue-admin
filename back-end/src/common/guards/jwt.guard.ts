import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators/jwt.decorator';
import { Observable } from 'rxjs';

/**
 * JWT 认证守卫
 * 用于保护路由，确保只有经过身份验证的用户才能访问
 * 继承自 AuthGuard('jwt')，实现 JWT 认证逻辑
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * 构造函数
   * @param reflector - NestJS 反射器，用于获取路由元数据
   */
  constructor(private readonly reflector: Reflector) {
    // 调用父类构造函数，初始化 JWT 认证守卫
    super();
  }

  /**
   * 判断路由是否可以激活
   * 检查路由是否标记为公共访问，如果是则允许访问，否则执行 JWT 认证
   * @param context - 执行上下文
   * @returns boolean | Promise<boolean> | Observable<boolean> - 是否可以激活路由
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 检查路由或控制器是否被标记为公共访问（无需认证）
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // 检查路由处理函数
      context.getClass(), // 检查控制器类
    ]);

    // 如果是公共路由则允许访问，否则执行父类的 canActivate 方法进行 JWT 认证
    return isPublic || super.canActivate(context);
  }

  /**
   * 处理认证请求结果
   * @param err - 认证过程中发生的错误
   * @param user - 认证成功的用户信息
   * @returns User - 认证成功的用户信息
   * @throws UnauthorizedException - 当认证失败时抛出未授权异常
   */
  handleRequest<User>(err: any, user: any): User {
    // 如果认证过程中有错误或用户信息不存在，则抛出异常
    if (err || !user) {
      throw err || new UnauthorizedException('请先登录');
    }

    // 返回认证成功的用户信息
    return user as User;
  }
}

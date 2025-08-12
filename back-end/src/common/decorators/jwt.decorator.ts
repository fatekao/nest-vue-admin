import { createParamDecorator, SetMetadata, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * 公共路由标识键值
 * 用于标记不需要JWT验证的公共路由
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 公共路由装饰器
 * 标记路由为公共访问，无需JWT token验证
 * @returns 路由元数据，标识为公共路由
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * 当前用户装饰器
 * 从请求中提取已验证的用户信息
 * 该装饰器需要在JWT验证通过后使用，即在JwtAuthGuard保护的路由中使用
 *
 * @param data - 装饰器传递的数据（未使用）
 * @param ctx - 执行上下文
 * @returns 已验证的用户信息
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  // 获取HTTP请求上下文
  const request = ctx.switchToHttp().getRequest<Request>();
  // 返回请求中包含的用户信息（由JWT策略验证后添加）
  return request.user;
});

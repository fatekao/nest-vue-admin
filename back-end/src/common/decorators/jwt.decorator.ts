import { createParamDecorator, SetMetadata, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SysUser } from '@prisma/client';

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

export const CurrentUser = createParamDecorator((data: keyof SysUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user as Partial<SysUser>;
  return data ? user[data] : user;
});

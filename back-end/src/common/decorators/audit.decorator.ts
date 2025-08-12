import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CreateAuditDto, UpdateAuditDto } from '@/common/dto/audit.dto';
import { SysUser } from '@prisma/client';

// 定义带 user 属性的请求接口
interface AuthenticatedRequest extends Request {
  user: SysUser;
}

/**
 * 创建审计装饰器
 * 自动填充创建人信息（如果存在认证用户）
 */
export const AuditParamDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

  const injectAudit = <T extends CreateAuditDto>(val: T): T => {
    return {
      ...val,
      createBy: request.user.userId,
      updateBy: request.user.userId,
    };
  };

  return injectAudit;
});

export type CreateAuditType = <T extends CreateAuditDto>(data: T) => T;
export type UpdateAuditType = <T extends UpdateAuditDto>(data: T) => T;

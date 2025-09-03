import { SysUser } from '@prisma/client';

declare global {
  interface AuthenticatedRequest extends Request {
    user: SysUser;
  }

  interface JWTPayload {
    userId: number;
    username: string;
    roleIds?: number[];
    iat?: number;
    exp?: number;
  }
}

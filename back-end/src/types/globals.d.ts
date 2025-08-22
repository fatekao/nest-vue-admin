import { SysUser } from '@prisma/client';

declare global {
  interface AuthenticatedRequest extends Request {
    user: SysUser;
  }
}

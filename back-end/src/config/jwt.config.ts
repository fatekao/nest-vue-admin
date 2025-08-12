import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  cookieSecure: boolean;
  cookieHttpOnly: boolean;
}

export default registerAs('jwt', (): JwtConfig => {
  // 验证必需的环境变量
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
  const cookieSecure = Boolean(process.env.JWT_COOKIE_SECURE);
  const cookieHttpOnly = Boolean(process.env.JWT_COOKIE_HTTP_ONLY);

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  if (!expiresIn) {
    throw new Error('JWT_EXPIRES_IN environment variable is required');
  }

  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is required');
  }

  if (!refreshExpiresIn) {
    throw new Error('JWT_REFRESH_EXPIRES_IN environment variable is required');
  }

  if (!cookieSecure) {
    throw new Error('JWT_COOKIE_SECURE environment variable is required');
  }

  if (!cookieHttpOnly) {
    throw new Error('JWT_COOKIE_HTTP_ONLY environment variable is required');
  }

  return {
    secret,
    expiresIn,
    refreshSecret,
    refreshExpiresIn,
    cookieSecure,
    cookieHttpOnly,
  };
});

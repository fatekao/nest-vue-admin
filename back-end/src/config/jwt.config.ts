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
  const cookieSecure = process.env.JWT_COOKIE_SECURE === 'true';
  const cookieHttpOnly = process.env.JWT_COOKIE_HTTP_ONLY === 'true';

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

  // 对于布尔值变量，我们使用默认值而不是强制要求
  // 因为它们通常有合理的默认值

  return {
    secret,
    expiresIn,
    refreshSecret,
    refreshExpiresIn,
    cookieSecure: cookieSecure ?? false,
    cookieHttpOnly: cookieHttpOnly ?? true,
  };
});

/**
 * 缓存相关常量
 */
export const CACHE_TTL = {
  // 短期缓存 5分钟
  SHORT: 5 * 60,
  // 中期缓存 30分钟
  MEDIUM: 30 * 60,
  // 长期缓存 1小时
  LONG: 60 * 60,
  // 超长期缓存 24小时
  EXTRA_LONG: 24 * 60 * 60,
  // JWT Token缓存 7天
  JWT_TOKEN: 7 * 24 * 60 * 60,
} as const;

/**
 * 缓存键前缀
 */
export const CACHE_PREFIX = {
  USER: 'user',
  ROLE: 'role',
  PERMISSION: 'permission',
  MENU: 'menu',
  TOKEN: 'token',
  LOGIN_ATTEMPT: 'login_attempt',
} as const;

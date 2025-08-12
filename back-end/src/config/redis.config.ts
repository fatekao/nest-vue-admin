import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  prefix: string;
  ttl: number;
  retryStrategy: (times: number) => number;
}

export default registerAs<RedisConfig>('redis', () => {
  // 验证必需的环境变量
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;
  const password = process.env.REDIS_PASSWORD;
  const db = process.env.REDIS_DB;
  const prefix = process.env.REDIS_PREFIX;

  if (!host) {
    throw new Error('REDIS_HOST environment variable is required');
  }

  if (!port) {
    throw new Error('REDIS_PORT environment variable is required');
  }

  if (!password) {
    throw new Error('REDIS_PASSWORD environment variable is required');
  }

  if (!db) {
    throw new Error('REDIS_DB environment variable is required');
  }

  if (!prefix) {
    throw new Error('REDIS_PREFIX environment variable is required');
  }

  return {
    host,
    port: parseInt(port, 10),
    password,
    db: parseInt(db, 10),
    prefix,
    ttl: 60 * 60 * 24 * 7, // 缓存7天
    retryStrategy: (times: number) => {
      // 重试策略: 最大延迟10秒，或者直接连接失败
      return Math.min(times * 50, 10000);
    },
  };
});

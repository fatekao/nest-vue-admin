import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  url?: string; // 添加可选的数据库URL配置
}

export default registerAs('database', (): DatabaseConfig => {
  // 验证必需的环境变量
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host) {
    throw new Error('DB_HOST or DATABASE_HOST environment variable is required');
  }

  if (!port) {
    throw new Error('DB_PORT or DATABASE_PORT environment variable is required');
  }

  if (!username) {
    throw new Error('DB_USERNAME or DATABASE_USERNAME environment variable is required');
  }

  if (!password) {
    throw new Error('DB_PASSWORD or DATABASE_PASSWORD environment variable is required');
  }

  if (!database) {
    throw new Error('DB_NAME or DATABASE_NAME environment variable is required');
  }

  return {
    host,
    port: parseInt(port, 10),
    username,
    password,
    database,
    url: process.env.DB_URL, // 可选的数据库URL
  };
});

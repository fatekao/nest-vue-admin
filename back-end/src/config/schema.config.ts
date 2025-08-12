import * as joi from 'joi';

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  HOST: string;
  DB_TYPE: 'mysql' | 'postgres' | 'sqlite' | 'mongodb' | 'cockroachdb';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_URL?: string;
  // Redis 配置
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_PASSWORD?: string;
  REDIS_PREFIX?: string;
  REDIS_DB?: number;
  [key: string]: any;
  // JWT 配置
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_REFRESH_EXPIRES_IN?: string;
  JWT_COOKIE_SECURE?: boolean;
  JWT_COOKIE_HTTP_ONLY?: boolean;
}

export const configJoiSchema = joi.object<EnvironmentVariables>({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(3000),
  HOST: joi.string().default('localhost'),
  DB_TYPE: joi.string().valid('mysql', 'postgres', 'sqlite', 'mongodb', 'cockroachdb').required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_URL: joi.string().optional(),
  // Redis 配置验证
  REDIS_HOST: joi.string().optional(),
  REDIS_PORT: joi.number().optional(),
  REDIS_PASSWORD: joi.string().optional(),
  REDIS_PREFIX: joi.string().optional(),
  REDIS_DB: joi.number().integer().min(0).max(15).optional(),
  // jwt 配置验证
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().required(),
  JWT_REFRESH_SECRET: joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: joi.string().required(),
  JWT_COOKIE_SECURE: joi.boolean().default(false),
  JWT_COOKIE_HTTP_ONLY: joi.boolean().default(true),
});

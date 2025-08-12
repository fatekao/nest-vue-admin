import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

/**
 * Redis服务类，提供对Redis的各种操作方法
 * 包括基本的键值操作、哈希操作、过期时间管理等
 */
@Injectable()
export class RedisService {
  /**
   * 构造函数，注入Redis实例
   * @param redis Redis实例
   */
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * 获取指定键的值
   * @param key 键名
   * @returns 解析后的值或null（如果键不存在）
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  /**
   * 设置键值对
   * @param key 键名
   * @param value 值（可以是任意类型，会自动序列化）
   * @param ttl 过期时间（秒）
   */
  async set(key: string, value: any, ttl?: number): Promise<string> {
    let serializedValue: string;

    // 根据值的类型进行序列化处理
    if (typeof value === 'object' && value !== null) {
      serializedValue = JSON.stringify(value);
    } else {
      serializedValue = String(value);
    }

    // 如果设置了过期时间，则使用EX选项设置过期时间
    if (ttl) {
      return await this.redis.set(key, serializedValue, 'EX', ttl);
    } else {
      return await this.redis.set(key, serializedValue);
    }
  }

  /**
   * 删除一个或多个键
   * @param key 键名（可以是单个键或键数组）
   */
  async del(key: string | string[]): Promise<void> {
    const keys = Array.isArray(key) ? key : [key];
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  /**
   * 检查键是否存在
   * @param key 键名
   * @returns 键是否存在
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result > 0;
  }

  /**
   * 查找所有符合给定模式的键
   * @param pattern 模式字符串（支持通配符）
   * @returns 符合模式的键数组
   */
  async keys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern);
  }

  /**
   * 为键设置过期时间
   * @param key 键名
   * @param ttl 过期时间（秒）
   * @returns 设置是否成功
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.redis.expire(key, ttl);
    return result === 1;
  }

  /**
   * 获取键的剩余生存时间
   * @param key 键名
   * @returns 剩余生存时间（秒），-1表示永不过期，-2表示键不存在
   */
  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }

  /**
   * 设置哈希表字段的值
   * @param key 哈希表名
   * @param field 字段名
   * @param value 值（可以是任意类型，会自动序列化）
   */
  async hset(key: string, field: string, value: any): Promise<void> {
    let serializedValue: string;

    // 根据值的类型进行序列化处理
    if (typeof value === 'object' && value !== null) {
      serializedValue = JSON.stringify(value);
    } else {
      serializedValue = String(value);
    }

    await this.redis.hset(key, field, serializedValue);
  }

  /**
   * 获取哈希表字段的值
   * @param key 哈希表名
   * @param field 字段名
   * @returns 解析后的值或null（如果字段不存在）
   */
  async hget<T>(key: string, field: string): Promise<T | null> {
    const data = await this.redis.hget(key, field);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  /**
   * 删除哈希表中的一个或多个字段
   * @param key 哈希表名
   * @param field 字段名（可以是单个字段或字段数组）
   * @returns 被成功删除的字段数量
   */
  async hdel(key: string, field: string | string[]): Promise<number> {
    const fields = Array.isArray(field) ? field : [field];
    return await this.redis.hdel(key, ...fields);
  }

  /**
   * 检查哈希表中字段是否存在
   * @param key 哈希表名
   * @param field 字段名
   * @returns 字段是否存在
   */
  async hexists(key: string, field: string): Promise<boolean> {
    const result = await this.redis.hexists(key, field);
    return result === 1;
  }

  /**
   * 获取哈希表中所有字段和值
   * @param key 哈希表名
   * @returns 包含所有字段和值的对象
   */
  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    const data = await this.redis.hgetall(key);
    if (!data || Object.keys(data).length === 0) return null;

    const result: Record<string, T> = {};
    for (const [field, value] of Object.entries(data)) {
      try {
        result[field] = JSON.parse(value) as T;
      } catch {
        result[field] = value as unknown as T;
      }
    }
    return result;
  }
}

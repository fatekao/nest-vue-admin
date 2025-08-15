import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfig } from '@/config/redis.config';

@Global()
@Module({
  imports: [
    IORedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>('redis');
        if (!redisConfig) {
          throw new Error('Redis configuration is missing');
        }
        const { host, port, password, db, prefix, ttl, retryStrategy } = redisConfig;
        return {
          type: 'single',
          options: {
            host,
            port,
            password,
            db,
            prefix,
            ttl,
            retryStrategy,
          },
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

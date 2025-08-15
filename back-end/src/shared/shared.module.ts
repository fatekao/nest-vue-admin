import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [LoggerModule, PrismaModule, RedisModule],
})
export class SharedModule {}

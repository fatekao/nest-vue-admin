import { Global, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

import { ConfigModule } from '@nestjs/config';
import config from '@/config/index';
import { configJoiSchema } from '@/config/schema.config';

import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@/common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

import { LoggerMiddleware } from '@/common/middleware/Logger.middleware';

const envPath = `.env.${process.env.NODE_ENV || 'development'}`;

console.log(`当前启动的环境为：${envPath}`);

@Global()
@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    RedisModule,
    // 全局配置模块
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局模块
      envFilePath: envPath, // 环境变量文件路径
      load: [...Object.values(config)], // 加载自定义配置
      validationSchema: configJoiSchema, // 配置验证模式
      validationOptions: {
        allowUnknown: true, // 允许未知配置项
        abortEarly: true, // 遇到第一个错误就停止验证
      },
      cache: true, // 启用配置缓存
    }),
  ],
  providers: [
    // 注册全局异常过滤器，处理其他未捕获的异常
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // 自动剥离 DTO 中未定义的字段
        transform: true, // 自动转换类型
        transformOptions: {
          enableImplicitConversion: true, // 启用隐式类型转换
        },
      }),
    },
    // 注册全局 Prisma 异常过滤器，专门处理 Prisma 错误
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    // 注册全局响应拦截器，统一响应格式
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

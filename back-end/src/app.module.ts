import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './modules/system/system.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';

import { LoggerMiddleware } from './common/middleware/Logger.middleware';

import { ConfigModule } from '@nestjs/config';
import config from '@/config/index';
import { configJoiSchema } from '@/config/schema.config';

/**
 * 根据环境变量确定配置文件路径
 */
const getNodeEnv = () => process.env.NODE_ENV || 'development';
const envPath = `.env.${getNodeEnv()}`;

console.log(`当前启动的环境为：${envPath}`);

/**
 * 应用根模块
 * 负责导入和组织所有子模块
 */
@Module({
  imports: [
    SystemModule, // 系统业务模块
    AuthModule, // 认证模块
    SharedModule, // 公共模块，包含通用服务和工具
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
  controllers: [], // 注册控制器
  providers: [AppService], // 注册服务提供者
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 添加中间件
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

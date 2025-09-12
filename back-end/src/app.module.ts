import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { SystemModule } from './modules/system/system.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';

/**
 * 应用根模块
 * 负责导入和组织所有子模块
 */
@Module({
  imports: [SystemModule, AuthModule, SharedModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

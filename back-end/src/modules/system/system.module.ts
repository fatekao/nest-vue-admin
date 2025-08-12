import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [UserModule, MenuModule],
})
export class SystemModule {}

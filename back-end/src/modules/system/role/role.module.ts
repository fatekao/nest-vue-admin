import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { CreatePipe } from '@/common/pipes/create.pipe';
import { UpdatePipe } from '@/common/pipes/update.pipe';

@Module({
  controllers: [RoleController],
  providers: [RoleService, CreatePipe, UpdatePipe],
})
export class RoleModule {}

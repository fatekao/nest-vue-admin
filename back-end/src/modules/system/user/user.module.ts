import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CreatePipe } from '@/common/pipes/create.pipe';
import { UpdatePipe } from '@/common/pipes/update.pipe';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, CreatePipe, UpdatePipe],
  exports: [UserService],
})
export class UserModule {}

import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuditParamDecorator, CreateAuditType, UpdateAuditType } from '@/common/decorators/audit.decorator';
import { CreateUserDto, UpdateUserDto } from './dto/req-user.dto';
// import { Public } from '@/common/decorators/jwt.decorator';

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto, @AuditParamDecorator() injectAudit: CreateAuditType) {
    return this.userService.create(injectAudit(createUserDto));
  }

  @Get('/page')
  findAll() {
    return this.userService.findAll();
  }

  @Get('detail')
  findOne(@Query('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post('/update')
  update(@Body() updateUserDto: UpdateUserDto, @AuditParamDecorator() injectAudit: UpdateAuditType) {
    return this.userService.update(injectAudit(updateUserDto));
  }

  @Post('/delete')
  remove(@Body('id') id: string) {
    return this.userService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuditParamDecorator, CreateAuditType, UpdateAuditType } from '@/common/decorators/audit.decorator';
import { CreateUserDto, UpdateUserDto, UserPageRequeryDto } from './dto/req-user.dto';
import { Public } from '@/common/decorators/jwt.decorator';
import { ParamsVerifyPipe } from '@/common/pipes/params-verify.pipe';
import { ApiQuery } from '@nestjs/swagger';

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/create')
  create(@Body() createUserDto: CreateUserDto, @AuditParamDecorator() injectAudit: CreateAuditType) {
    return this.userService.create(injectAudit(createUserDto));
  }

  @Get('/page')
  @ApiQuery(UserPageRequeryDto)
  async findAll(@Query(new ParamsVerifyPipe()) query: UserPageRequeryDto) {
    return await this.userService.findPage(query);
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

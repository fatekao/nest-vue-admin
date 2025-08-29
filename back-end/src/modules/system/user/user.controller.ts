import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserIdDto, UserPageRequeryDto, UpdateUserPwdDto } from './dto/req-user.dto';
import { Public } from '@/common/decorators/jwt.decorator';
import { ParamsVerifyPipe } from '@/common/pipes/params-verify.pipe';
import { CreatePipe } from '@/common/pipes/create.pipe';
import { ApiQuery, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('用户管理')
@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body(CreatePipe) createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
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
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(updateUserDto);
  }

  @Post('/delete')
  remove(@Body('id') id: string) {
    return this.userService.remove(+id);
  }

  @ApiOperation({ summary: '更新密码' })
  @ApiBody({ type: UserIdDto })
  @Public()
  @Post('/resetPassword')
  async resetPassword(@Body('id') id: string) {
    return await this.userService.resetPassword(+id);
  }

  @ApiOperation({ summary: '更新密码' })
  @ApiBody({ type: UpdateUserPwdDto })
  @Public()
  @Post('/updatePassword')
  async updatePassword(@Body() updateUserPwdDto: UpdateUserPwdDto) {
    return await this.userService.updatePassword(
      updateUserPwdDto.id,
      updateUserPwdDto.oldPassword,
      updateUserPwdDto.newPassword,
    );
  }
}

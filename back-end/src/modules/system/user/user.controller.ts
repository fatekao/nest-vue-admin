import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserIdDto, UserPageRequeryDto, UpdateUserPwdDto } from './dto/req-user.dto';
import { UserInfoCreateResDto, UserInfoResDto, UserInfoWithNameResDto } from './dto/res-user.dto';
import { CreatePipe } from '@/common/pipes/create.pipe';
import { UpdatePipe } from '@/common/pipes/update.pipe';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerBaseApiResponse, SwaggerPaginatedResponse } from '@/common/dto/response.dto';
import { PaginationResDto } from '@/common/dto/pagination.dto';

@ApiTags('用户管理')
@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post('/create')
  @ApiResponse({ type: SwaggerBaseApiResponse(UserInfoCreateResDto) })
  async create(@Body(CreatePipe) createUserDto: CreateUserDto): Promise<UserInfoCreateResDto> {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '获取用户列表' })
  @Get('/page')
  @ApiResponse({ type: SwaggerPaginatedResponse(UserInfoWithNameResDto) })
  async findAll(@Query() query: UserPageRequeryDto): Promise<PaginationResDto<UserInfoWithNameResDto>> {
    return await this.userService.findPage(query);
  }

  @ApiOperation({ summary: '获取用户详情' })
  @Get('detail')
  findOne(@Query('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: '更新用户' })
  @Post('/update')
  @ApiResponse({ type: SwaggerBaseApiResponse(UserInfoResDto) })
  async update(@Body(UpdatePipe) updateUserDto: UpdateUserDto): Promise<UserInfoResDto> {
    return await this.userService.update(updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @Post('/delete')
  remove(@Body() user: UserIdDto) {
    return this.userService.remove(user.id);
  }

  @ApiOperation({ summary: '重置密码' })
  @Post('/resetPassword')
  async resetPassword(@Body() user: UserIdDto) {
    return await this.userService.resetPassword(user.id);
  }

  @ApiOperation({ summary: '更新密码' })
  @Post('/updatePassword')
  async updatePassword(@Body() updateUserPwdDto: UpdateUserPwdDto) {
    return await this.userService.updatePassword(
      updateUserPwdDto.id,
      updateUserPwdDto.oldPassword,
      updateUserPwdDto.newPassword,
    );
  }
}

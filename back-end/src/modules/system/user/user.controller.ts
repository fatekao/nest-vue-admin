import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserPageRequeryDto } from './dto/req-user.dto';
import { Public } from '@/common/decorators/jwt.decorator';
import { ParamsVerifyPipe } from '@/common/pipes/params-verify.pipe';
import { ApiQuery } from '@nestjs/swagger';

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
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
}

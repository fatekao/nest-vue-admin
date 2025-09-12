import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { LoginDto } from './dto/req-auth.dto';
import { AuthUserInfoDto } from './dto/res-auth.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../common/guards/local.guard';

import { CurrentUser, Public } from '@/common/decorators/jwt.decorator';

@Controller('auth')
@ApiTags('认证模块')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ApiOperation({ summary: '登录', description: '登录接口获取token' })
  @ApiBody({ type: LoginDto })
  signIn(@Body() loginDto: LoginDto, @Request() req: AuthenticatedRequest): Promise<{ accessToken: string }> {
    return this.authService.signIn(req.user);
  }

  @Get('getUserInfo')
  @ApiOperation({ summary: '获取用户信息', description: '根据token获取用户信息' })
  @ApiResponse({ type: AuthUserInfoDto })
  async getUserInfo(@CurrentUser('userId') userId: number): Promise<AuthUserInfoDto> {
    return await this.authService.getUserInfo(userId);
  }
}

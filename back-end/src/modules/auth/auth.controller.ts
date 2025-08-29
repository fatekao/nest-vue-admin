import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ParamsVerifyPipe } from '@/common/pipes/params-verify.pipe';
import { LoginDto } from './dto/req-auth.dto';
import { AuthUserInfoDto } from './dto/res-auth.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from '@/modules/system/user/entities/user.entity';

import { LocalAuthGuard } from '../../common/guards/local.guard';

import { CurrentUser } from '@/common/decorators/jwt.decorator';

// 定义带 user 属性的请求接口
interface AuthenticatedRequest extends Request {
  user: UserEntity;
}

@Controller('auth')
@ApiTags('认证模块')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '登录', description: '登录接口获取token' })
  @ApiBody({ type: LoginDto })
  signIn(
    @Body(new ParamsVerifyPipe()) loginDto: LoginDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(req.user);
  }

  @Get('getUserInfo')
  @ApiOperation({ summary: '获取用户信息', description: '根据token获取用户信息' })
  @ApiResponse({ type: AuthUserInfoDto })
  async getUserInfo(@CurrentUser('id') userId: number): Promise<AuthUserInfoDto> {
    return await this.authService.getUserInfo(userId);
  }
}

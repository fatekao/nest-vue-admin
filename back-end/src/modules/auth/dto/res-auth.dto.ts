import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserInfoDto } from '@/modules/system/user/dto/res-user.dto';

/**
 * 用户认证数据传输对象
 * 用于创建新用户的登录请求数据验证
 */
export class LoginTokenDto {
  @ApiProperty({ description: 'JWT Token' })
  token: string;
}

export class AuthUserInfoDto extends UserInfoDto {
  @ApiProperty({ description: '用户角色' })
  roles: string[];
}

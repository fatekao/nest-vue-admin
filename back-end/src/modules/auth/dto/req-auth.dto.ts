import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名', required: true, example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;

  @ApiProperty({ description: '密码', required: true, example: 'Password123!' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  password: string;

  @ApiProperty({
    description: '验证码',
    example: 'AB12',
    maxLength: 4,
    minLength: 4,
  })
  @MinLength(4, { message: '验证码长度必须为4位' })
  @MaxLength(4, { message: '验证码长度必须为4位' })
  code: string;
}

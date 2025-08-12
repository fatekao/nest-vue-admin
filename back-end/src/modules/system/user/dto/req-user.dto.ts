import { OmitType, ApiProperty } from '@nestjs/swagger';
import { AuditDto } from '@/common/dto/audit.dto';
import { IsString, IsEmail, IsInt, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

// 新增用户
export class CreateUserDto extends AuditDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '昵称', example: '管理员' })
  @IsString()
  @IsNotEmpty()
  nickName: string;

  @ApiProperty({ description: '性别', example: 1, required: false })
  @IsInt()
  @IsOptional()
  gender?: number;

  @ApiProperty({ description: '邮箱', example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '手机号', example: '13800000000' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '头像', example: '', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: '状态', example: 1, required: false })
  @IsInt()
  @IsOptional()
  status?: number;

  @ApiProperty({ description: '角色', example: 1, required: false })
  @IsInt()
  @IsOptional()
  role?: number;
}

// 更新用户
export class UpdateUserDto extends OmitType(CreateUserDto, ['username', 'password'] as const) {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsInt()
  userId: number;
}

// 重置密码
export class ResetUserPwdDto {
  @ApiProperty({ description: '用户ID', required: true, example: 1 })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: '新密码', required: true, example: 'newPassword123' })
  @IsNotEmpty()
  newPassword: string;
}

// 修改密码
export class UpdateUserPwdDto {
  @ApiProperty({ description: '用户ID', required: true, example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: '旧密码', required: true, example: 'oldPassword123' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: '新密码', required: true, example: 'newPassword123' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

// 删除用户
export class RemoveUserDto {
  @ApiProperty({ description: '用户ID', required: true, example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '是否删除', required: false, example: true })
  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;
}

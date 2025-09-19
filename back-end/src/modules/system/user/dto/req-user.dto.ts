import { OmitType, ApiProperty } from '@nestjs/swagger';
import { PaginationReqDto } from '@/common/dto/pagination.dto';
import { AuditDto } from '@/common/dto/audit.dto';
import {
  IsString,
  IsEmail,
  IsInt,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsEnum,
  Length,
  IsMobilePhone,
} from 'class-validator';
import { UserStatus, Gender } from '@/common/enums';

export class UserIdDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class updateUserPwdDto extends UserIdDto {
  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: '新密码不能为空' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
    message: '密码至少8位，需包含大小写字母、数字和特殊字符',
  })
  newPassword: string;
}

// 新增用户
export class CreateUserDto extends AuditDto {
  @ApiProperty({ description: '用户名，长度3-20位', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 20, { message: '用户名长度必须在3-20位之间' })
  username: string;

  @ApiProperty({ description: '昵称，长度1-50位', example: '管理员' })
  @IsString()
  @IsNotEmpty({ message: '昵称不能为空' })
  @Length(1, 50, { message: '昵称长度必须在1-50位之间' })
  nickName: string;

  @ApiProperty({ description: '性别：0-女，1-男', example: 1, required: false, enum: Gender })
  @IsEnum(Gender, { message: '性别只能为0(女)或1(男)' })
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ description: '邮箱', example: 'admin@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '手机号', example: '13800000000' })
  @IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' })
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;

  @ApiProperty({ description: '头像地址', example: '', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: '状态：0-禁用，1-正常，2-锁定', example: 1, required: false, enum: UserStatus })
  @IsEnum(UserStatus, { message: '状态值不正确' })
  @IsOptional()
  status?: UserStatus;
}

// 更新用户
export class UpdateUserDto extends OmitType(CreateUserDto, ['username'] as const) {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsInt()
  id: number;
}

// 重置密码
export class ResetUserPwdDto {
  @ApiProperty({ description: '用户ID', required: true, example: 1 })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '新密码', required: true, example: 'newPassword123' })
  @IsNotEmpty()
  newPassword: string;
}

// 修改密码
export class UpdateUserPwdDto {
  @ApiProperty({ description: '用户ID', required: true, example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '旧密码', required: true, example: 'oldPassword123' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: '新密码', required: true, example: 'newPassword123' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UserPageRequeryDto extends PaginationReqDto {
  @ApiProperty({ description: '用户名', required: false, example: 'username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: '角色ID', required: false, example: 1 })
  @IsInt()
  @IsOptional()
  roleId?: number;
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

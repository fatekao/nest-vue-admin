import { OmitType, ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  IsString,
  IsEmail,
  IsInt,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsArray,
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
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
    message: '密码至少8位，需包含大小写字母、数字和特殊字符',
  })
  newPassword: string;
}

// 新增用户
export class CreateUserDto {
  @ApiProperty({ description: '用户名，长度3-20位', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: '用户名长度必须在3-20位之间' })
  username: string;

  @ApiProperty({ description: '密码，至少8位，包含大小写字母、数字和特殊字符', example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
    message: '密码至少8位，需包含大小写字母、数字和特殊字符',
  })
  password: string;

  @ApiProperty({ description: '昵称，长度1-50位', example: '管理员' })
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: '头像地址', example: '', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: '状态：0-禁用，1-正常，2-锁定', example: 1, required: false, enum: UserStatus })
  @IsEnum(UserStatus, { message: '状态值不正确' })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: '角色ID列表', example: [1, 2], required: false })
  @IsArray()
  @IsInt({ each: true, message: '角色ID必须为整数' })
  @IsOptional()
  roleIds?: number[];
}

// 更新用户
export class UpdateUserDto extends OmitType(CreateUserDto, ['username', 'password'] as const) {
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

export class UserPageRequeryDto extends PaginationDto {
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

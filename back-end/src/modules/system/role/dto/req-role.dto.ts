import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty, IsEnum, IsArray, Min, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { RoleStatus } from '@/common/enums';

export class RoleIdDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsInt({ message: '角色ID必须为整数' })
  @IsNotEmpty({ message: '角色ID不能为空' })
  id: number;
}
export class CreateRoleDto {
  @ApiProperty({ description: '角色名称，长度1-50位', example: '管理员' })
  @IsString({ message: '角色名称必须为字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @MaxLength(50, { message: '角色名称长度不能超过50位' })
  name: string;

  @ApiProperty({ description: '角色标识，长度1-50位', example: 'admin' })
  @IsString({ message: '角色标识必须为字符串' })
  @IsNotEmpty({ message: '角色标识不能为空' })
  @MaxLength(50, { message: '角色标识长度不能超过50位' })
  key: string;

  @ApiProperty({ description: '状态：0-正常，1-停用', example: 0, required: false, enum: RoleStatus })
  @IsEnum(RoleStatus, { message: '状态值不正确，只能为0(正常)或1(停用)' })
  @IsOptional()
  status: RoleStatus;

  @ApiProperty({ description: '备注信息', example: '系统管理员角色', required: false })
  @IsString({ message: '备注信息必须为字符串' })
  @IsOptional()
  @MaxLength(255, { message: '备注信息长度不能超过255个字符' })
  remark?: string;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsInt({ message: '排序必须为整数' })
  @IsOptional()
  sort?: number;
}

export class UpdateRoleDto extends IntersectionType(CreateRoleDto, RoleIdDto) {}

export class RolePageQueryDto extends PaginationDto {
  @ApiProperty({ description: '模糊搜索', required: false, example: '管理员' })
  @IsOptional()
  keyword?: string;

  @ApiProperty({ description: '状态', required: false, example: 0, enum: RoleStatus })
  @IsEnum(RoleStatus, { message: '状态值不正确，只能为0(正常)或1(停用)' })
  @IsOptional()
  status?: RoleStatus;
}

export class AssignPermissionsDto extends RoleIdDto {
  @ApiProperty({ description: '权限ID列表', example: [1, 2, 3] })
  @IsArray({ message: '权限ID列表必须为数组' })
  @IsInt({ each: true, message: '权限ID必须为整数' })
  @Min(1, { each: true, message: '权限ID必须大于0' })
  permissionIds: number[];
}

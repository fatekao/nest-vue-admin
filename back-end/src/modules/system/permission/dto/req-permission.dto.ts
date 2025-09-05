import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty, Length, IsEnum, IsBoolean } from 'class-validator';
import { PermissionType } from '@/common/enums';

export class CreatePermissionDto {
  @ApiProperty({ description: '菜单名称，长度1-100位', example: '用户管理' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: '菜单名称长度必须在1-100位之间' })
  name: string;

  @ApiProperty({ description: '菜单类型：0-目录，1-菜单，2-按钮', example: 1, enum: PermissionType })
  @IsEnum(PermissionType, { message: '菜单类型不正确' })
  type: PermissionType;

  @ApiProperty({ description: '父级菜单ID', example: 0, required: false })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: '路由路径', example: '/system/user', required: false })
  @IsString()
  @IsOptional()
  @Length(0, 200, { message: '路由路径长度不能超过200位' })
  path?: string;

  @ApiProperty({ description: '组件路径', example: 'system/user/index', required: false })
  @IsString()
  @IsOptional()
  @Length(0, 200, { message: '组件路径长度不能超过200位' })
  component?: string;

  @ApiProperty({ description: '菜单图标', example: 'user', required: false })
  @IsString()
  @IsOptional()
  @Length(0, 100, { message: '图标长度不能超过100位' })
  icon?: string;

  @ApiProperty({ description: '权限标识', example: 'system:user:list', required: false })
  @IsString()
  @IsOptional()
  @Length(0, 100, { message: '权限标识长度不能超过100位' })
  permission?: string;

  @ApiProperty({ description: '显示顺序', example: 1, required: false })
  @IsInt()
  @IsOptional()
  orderNum?: number;

  @ApiProperty({ description: '是否可见', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @ApiProperty({ description: '是否可缓存', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isCacheable?: boolean;
}

export class UpdatePermissionDto extends OmitType(CreatePermissionDto, [] as const) {
  @ApiProperty({ description: '菜单ID', example: 1 })
  @IsInt()
  id: number;
}

export class PermissionQueryDto {
  @ApiProperty({ description: '菜单名称', required: false, example: '用户管理' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '菜单类型', required: false, example: 1, enum: PermissionType })
  @IsEnum(PermissionType)
  @IsOptional()
  type?: PermissionType;

  @ApiProperty({ description: '是否可见', required: false, example: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

export class PermissionIdDto {
  @ApiProperty({ description: '菜单ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;
}

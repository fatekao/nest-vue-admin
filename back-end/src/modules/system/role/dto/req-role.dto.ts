import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty, Length, IsEnum, IsArray } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { RoleStatus } from '@/common/enums';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称，长度1-50位', example: '管理员' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: '角色名称长度必须在1-50位之间' })
  name: string;

  @ApiProperty({ description: '角色标识，长度1-50位', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: '角色标识长度必须在1-50位之间' })
  key: string;

  @ApiProperty({ description: '状态：0-正常，1-停用', example: 0, required: false, enum: RoleStatus })
  @IsEnum(RoleStatus, { message: '状态值不正确' })
  @IsOptional()
  status?: RoleStatus;

  @ApiProperty({ description: '备注信息', example: '系统管理员角色', required: false })
  @IsString()
  @IsOptional()
  @Length(0, 500, { message: '备注信息长度不能超过500位' })
  remark?: string;

  @ApiProperty({ description: '权限ID列表', example: [1, 2, 3], required: false })
  @IsArray()
  @IsInt({ each: true, message: '权限ID必须为整数' })
  @IsOptional()
  permissionIds?: number[];
}

export class UpdateRoleDto extends OmitType(CreateRoleDto, [] as const) {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsInt()
  id: number;
}

export class RolePageQueryDto extends PaginationDto {
  @ApiProperty({ description: '角色名称', required: false, example: '管理员' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '角色标识', required: false, example: 'admin' })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({ description: '状态', required: false, example: 0, enum: RoleStatus })
  @IsEnum(RoleStatus)
  @IsOptional()
  status?: RoleStatus;
}

export class RoleIdDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;
}

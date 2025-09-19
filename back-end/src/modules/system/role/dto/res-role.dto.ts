import { ApiProperty } from '@nestjs/swagger';
import { PermissionListResDto } from './../../permission/dto/res-permission.dto';
import { AuditDto } from '@/common/dto/audit.dto';
import { PaginationReqDto } from '@/common/dto/pagination.dto';

// 角色信息简单响应
export class RoleSimpleInfoResDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  id: number;

  @ApiProperty({ description: '角色名称', example: '管理员' })
  name: string;

  @ApiProperty({ description: '角色标识', example: 'admin' })
  key: string;

  @ApiProperty({ description: '状态：0-正常，1-停用', example: 0 })
  status: number;
}

// 角色信息响应
export class RoleInfoResDto extends AuditDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  id: number;

  @ApiProperty({ description: '角色名称', example: '管理员' })
  name: string;

  @ApiProperty({ description: '角色标识', example: 'admin' })
  key: string;

  @ApiProperty({ description: '状态：0-正常，1-停用', example: 0 })
  status: number;

  @ApiProperty({ description: '权限列表', required: false })
  permissions: number[];
}

// 角色简要信息响应（用于下拉选择）
export class RoleSimpleResDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  id: number;

  @ApiProperty({ description: '角色名称', example: '管理员' })
  name: string;

  @ApiProperty({ description: '角色标识', example: 'admin' })
  key: string;

  @ApiProperty({ description: '状态：0-正常，1-停用', example: 0 })
  status: number;
}

// 角色列表分页响应
export class RolePageResDto extends PaginationReqDto {
  @ApiProperty({ description: '角色列表', type: [RoleInfoResDto] })
  list: RoleInfoResDto[];
}

// 角色权限关联响应
export class RolePermissionResDto {
  @ApiProperty({ description: '角色信息', type: RoleInfoResDto })
  role: RoleInfoResDto;

  @ApiProperty({ description: '权限ID列表', example: [1, 2, 3] })
  permissionIds: number[];

  @ApiProperty({ description: '权限列表', type: [PermissionListResDto] })
  permissions: PermissionListResDto[];
}

// 角色统计响应
export class RoleStatisticsResDto {
  @ApiProperty({ description: '总角色数', example: 10 })
  totalRoles: number;

  @ApiProperty({ description: '正常角色数', example: 8 })
  normalRoles: number;

  @ApiProperty({ description: '停用角色数', example: 2 })
  disabledRoles: number;

  @ApiProperty({ description: '最近创建角色数（7天内）', example: 3 })
  recentCreated: number;
}

import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AuditDto } from '@/common/dto/audit.dto';
import { RoleInfoResDto } from '@/modules/system/role/dto/res-role.dto';

// 用户信息响应
export class UserInfoResDto extends AuditDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number;

  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  @ApiProperty({ description: '昵称', example: '管理员' })
  nickName: string;

  @ApiProperty({ description: '性别：0-女，1-男', example: 1, required: false })
  gender: number | null;

  @ApiProperty({ description: '邮箱', example: 'admin@example.com', required: false })
  email: string | null;

  @ApiProperty({ description: '手机号', example: '13800000000', required: false })
  phone: string | null;

  @ApiProperty({ description: '头像', example: '', required: false })
  avatar: string | null;

  @ApiProperty({ description: '状态：0-禁用，1-正常，2-锁定', example: 1, required: false })
  status: number | null;

  @ApiProperty({ description: '角色', example: 1, required: false })
  roles: (RoleInfoResDto | null)[];

  @ApiProperty({ description: '创建人', example: '', required: false })
  createByName: string;

  @ApiProperty({ description: '更新人', example: '', required: false })
  updateByName: string;
}

export class UserInfoCreateResDto extends OmitType(UserInfoResDto, ['createByName', 'updateByName', 'roles'] as const) {
  @ApiProperty({ description: '临时密码', example: true })
  tempPassword: string;

  @ApiProperty({ description: '临时密码是否已使用', example: true })
  isTemporaryPassword: boolean;
}

// 用户列表分页响应
export class UserListResDto {
  @ApiProperty({ description: '用户列表', type: [UserInfoResDto] })
  users: UserInfoResDto[];
}

// 用户列表查询参数
export class UserPageResDto extends PaginationDto {
  @ApiProperty({ description: '用户列表', type: [UserInfoResDto] })
  list: UserInfoResDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AuditDto } from '@/common/dto/audit.dto';
import { RoleInfoResDto } from '@/modules/system/role/dto/res-role.dto';

// 用户信息响应
export class UserInfoResDto extends AuditDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  @ApiProperty({ description: '昵称', example: '管理员' })
  nickName: string;

  @ApiProperty({ description: '性别', example: 1, required: false })
  gender?: number | null;

  @ApiProperty({ description: '邮箱', example: 'admin@example.com' })
  email?: string | null;

  @ApiProperty({ description: '手机号', example: '13800000000' })
  phone?: string | null;

  @ApiProperty({ description: '头像', example: '', required: false })
  avatar?: string | null;

  @ApiProperty({ description: '状态', example: 1, required: false })
  status?: number | null;

  @ApiProperty({ description: '角色', example: 1, required: false })
  roles?: RoleInfoResDto[];
}

// 用户列表分页响应
export class UserListResDto {
  @ApiProperty({ description: '用户列表', type: [UserInfoResDto] })
  @IsArray()
  users: UserInfoResDto[];

  @ApiProperty({ description: '分页信息' })
  pagination: PaginationDto;
}

// 用户列表查询参数
export class UserPageResDto {
  @ApiProperty({ description: '用户列表', type: [UserInfoResDto] })
  @IsArray()
  list: UserInfoResDto[];

  @ApiProperty({ description: '分页信息' })
  pagination: PaginationDto;
}

import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { AuditDto, AuditWithNameDto } from '@/common/dto/audit.dto';
import { RoleSimpleInfoResDto } from '@/modules/system/role/dto/res-role.dto';
import { Exclude, Expose } from 'class-transformer';

// 用户信息响应
@Exclude()
export class UserInfoResDto extends AuditDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: '用户名', example: 'admin' })
  @Expose()
  username: string;

  @ApiProperty({ description: '昵称', example: '管理员' })
  @Expose()
  nickName: string;

  @ApiProperty({ description: '性别：0-女，1-男', example: 1, required: false })
  @Expose()
  gender: number | null;

  @ApiProperty({ description: '邮箱', example: 'admin@example.com', required: false })
  @Expose()
  email: string | null;

  @ApiProperty({ description: '手机号', example: '13800000000', required: false })
  @Expose()
  phone: string | null;

  @ApiProperty({ description: '头像', example: '', required: false })
  @Expose()
  avatar: string | null;

  @ApiProperty({ description: '状态：0-禁用，1-正常，2-锁定', example: 1, required: false })
  @Expose()
  status: number | null;

  @ApiProperty({ description: '角色', example: 1, required: false })
  @Expose()
  roles: (RoleSimpleInfoResDto | null)[];
}

@Exclude()
export class UserInfoCreateResDto extends UserInfoResDto {
  @ApiProperty({ description: '临时密码', example: true })
  @Expose()
  tempPassword?: string;

  @ApiProperty({ description: '临时密码是否已使用', example: true })
  @Expose()
  isTemporaryPassword?: boolean;
}

@Exclude()
export class UserInfoWithNameResDto extends IntersectionType(UserInfoResDto, AuditWithNameDto) {}

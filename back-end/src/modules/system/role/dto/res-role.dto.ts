import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { AuditDto } from '@/common/dto/audit.dto';

export class RoleInfoResDto extends AuditDto {
  @ApiProperty({ description: '角色id' })
  roleId: number;

  @ApiProperty({ description: '角色名称' })
  roleName: string;

  @ApiProperty({ description: '角色编码' })
  roleKey: string;

  @ApiProperty({ description: '角色描述' })
  status: number;
}

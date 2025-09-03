import { ApiProperty } from '@nestjs/swagger';
import { AuditDto } from '@/common/dto/audit.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class RoleInfoResDto extends AuditDto {
  @ApiProperty({ description: '角色ID', example: 1 })
  id: number;

  @ApiProperty({ description: '角色名称', example: '管理员' })
  name: string;

  @ApiProperty({ description: '角色标识', example: 'admin' })
  key: string;

  @ApiProperty({ description: '状态：0-正常，1-停用', example: 0 })
  status: number;

  @ApiProperty({ description: '备注信息', example: '系统管理员角色', required: false })
  remark: string | null;
}

export class RoleListResDto {
  @ApiProperty({ description: '角色列表', type: [RoleInfoResDto] })
  list: RoleInfoResDto[];

  @ApiProperty({ description: '分页信息' })
  pagination: PaginationDto;
}

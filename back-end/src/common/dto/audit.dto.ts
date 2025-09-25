import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

interface AuditObject {
  creator?: {
    nickName?: string;
  } | null;
  updater?: {
    nickName?: string;
  } | null;
}

export class AuditDto {
  createBy: number;

  updateBy: number;

  createTime: Date;

  updateTime: Date;
}

@Exclude()
export class AuditWithNameDto {
  @ApiProperty({ description: '创建时间', example: '2023-01-01 12:00:00' })
  @Expose()
  createTime: Date | null;

  @ApiProperty({ description: '更新时间', example: '2023-01-01 12:00:00' })
  @Expose()
  updateTime: Date | null;

  @ApiProperty({ description: '创建者名称', example: 'admin', required: false })
  @Expose()
  @Transform(({ obj }) => (obj as AuditObject).creator?.nickName || null, { toClassOnly: true })
  createByName: string | null;

  @ApiProperty({ description: '更新者名称', example: 'admin', required: false })
  @Expose()
  @Transform(({ obj }) => (obj as AuditObject).updater?.nickName || null, { toClassOnly: true })
  updateByName: string | null;
}

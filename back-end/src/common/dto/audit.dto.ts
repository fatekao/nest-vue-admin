import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class AuditDto {
  createBy: number;

  updateBy: number;

  createTime: Date;

  updateTime: Date;
}

export class AuditWithNameDto {
  creator: { nickName: string } | null;

  updater: { nickName: string } | null;

  @ApiProperty({ description: '创建者名称', example: 'admin', required: false })
  @Expose()
  get createByName(): string | null {
    return this.creator?.nickName || null;
  }

  @ApiProperty({ description: '更新者名称', example: 'admin', required: false })
  @Expose()
  get updateByName(): string | null {
    return this.updater?.nickName || null;
  }
}

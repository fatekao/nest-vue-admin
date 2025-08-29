import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
export class AuditDto {
  @ApiProperty({ description: '创建人', example: 'admin', required: false })
  @IsOptional()
  @IsNumber()
  createBy?: number | null;

  @ApiProperty({ description: '更新人', example: 'admin', required: false })
  @IsOptional()
  @IsNumber()
  updateBy?: number | null;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsString()
  createTime?: Date | string | null;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsString()
  updateTime?: Date | string | null;
}

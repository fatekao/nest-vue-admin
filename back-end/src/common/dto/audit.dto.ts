import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class AuditDto {
  @ApiProperty({ description: '创建人', example: 'admin', required: false })
  @IsOptional()
  @IsNumber()
  createBy?: number;

  @ApiProperty({ description: '更新人', example: 'admin', required: false })
  @IsOptional()
  @IsNumber()
  updateBy?: number;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsString()
  createTime?: string;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  updateTime?: string;
}

export class CreateAuditDto extends PickType(AuditDto, ['createBy', 'updateBy']) {}
export class UpdateAuditDto extends PickType(AuditDto, ['updateBy']) {}

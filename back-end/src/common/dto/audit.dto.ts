import { Expose, Transform } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
export class AuditDto {
  @ApiProperty({ description: '创建人', example: 'admin', required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  @Transform(({ value }) => Number(value))
  createBy?: number | null;

  @ApiProperty({ description: '更新人', example: 'admin', required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  @Transform(({ value }) => Number(value))
  updateBy?: number | null;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsString()
  @Expose()
  @Transform(({ value }) => new Date(value).toISOString())
  createTime?: Date | string | null;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsString()
  @Expose()
  @Transform(({ value }) => new Date(value).toISOString())
  updateTime?: Date | string | null;
}

export class CreateAuditDto extends PickType(AuditDto, ['createBy', 'updateBy']) {}
export class UpdateAuditDto extends PickType(AuditDto, ['updateBy']) {}

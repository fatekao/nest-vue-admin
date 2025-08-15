import { Expose, Type, Transform } from 'class-transformer';
import { IsInt, Min, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: '页码', example: 1, minimum: 1 })
  @Expose()
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小值为1' })
  @IsNotEmpty({ message: '页码不能为空' })
  @Transform(({ value }) => Number(value))
  page: number;

  @ApiProperty({ description: '每页数量', example: 10, minimum: 1 })
  @Expose()
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小值为1' })
  @IsNotEmpty({ message: '每页数量不能为空' })
  @Transform(({ value }) => Number(value))
  pageSize: number;

  @ApiPropertyOptional({ description: '总数', example: 100 })
  @IsOptional()
  @IsInt({ message: '总数必须是整数' })
  @Min(0, { message: '总数最小值为0' })
  total?: number;

  @ApiProperty({ description: '总页数', example: 10 })
  @IsOptional()
  @IsInt()
  totalPages?: number;
}

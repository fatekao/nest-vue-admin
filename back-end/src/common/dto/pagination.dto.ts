import { IsInt, Min, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationReqDto {
  @ApiProperty({ description: '页码', example: 1, minimum: 1 })
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小值为1' })
  @IsNotEmpty({ message: '页码不能为空' })
  @Expose()
  page: number;

  @ApiProperty({ description: '每页数量', example: 10, minimum: 1 })
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小值为1' })
  @IsNotEmpty({ message: '每页数量不能为空' })
  @Expose()
  pageSize: number;

  @ApiPropertyOptional({ description: '总数', example: 100 })
  @IsOptional()
  @IsInt({ message: '总数必须是整数' })
  @Min(0, { message: '总数最小值为0' })
  @Expose()
  total?: number;
}

export class PaginationResDto<T> {
  @ApiProperty({ description: '当前页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页大小', example: 10 })
  pageSize: number;

  @ApiProperty({ description: '总记录数', example: 100 })
  total: number;

  @ApiProperty({ description: '数据列表', isArray: true })
  list: T[];

  constructor(data: { list: T[]; total: number; page: number; pageSize: number }) {
    this.list = data.list;
    this.total = data.total;
    this.page = data.page;
    this.pageSize = data.pageSize;
  }
}

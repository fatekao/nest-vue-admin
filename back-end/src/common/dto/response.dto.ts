import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ example: 0 })
  code: number;

  @ApiProperty({ example: '成功' })
  message: string;

  @ApiProperty({ type: () => Object, nullable: true })
  data?: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ example: 1 })
  page: number;
  @ApiProperty({ example: 10 })
  pageSize: number;
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ type: [Object], description: '数据列表' })
  list: T[];
}
import { Type } from '@nestjs/common';

// 标准响应基础结构
class BaseApiResponse {
  @ApiProperty({ example: 0, description: '业务状态码' })
  code: number;

  @ApiProperty({ example: '成功', description: '提示信息' })
  message: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: '时间戳',
  })
  timestamp: string;
}

/**
 * 高阶函数：生成带 data 类型的标准响应类
 * 使用示例：SwaggerBaseApiResponse(UserInfoDto)
 */
export function SwaggerBaseApiResponse<T>(dataClass: Type<T>): Type<BaseApiResponse & { data: T }> {
  abstract class WrappedResponse extends BaseApiResponse {
    @ApiProperty({
      type: () => dataClass,
      description: '响应数据',
    })
    declare data: T;
  }

  // 💡 可选：美化类名，便于调试
  Object.defineProperty(WrappedResponse, 'name', {
    value: `Api${dataClass.name}Response`,
  });

  return WrappedResponse as Type<BaseApiResponse & { data: T }>;
}

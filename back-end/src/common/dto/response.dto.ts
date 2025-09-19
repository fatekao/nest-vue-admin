import { Type } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { PaginationResDto } from './pagination.dto';

export class ApiResponse<T> {
  @ApiProperty({ example: 0 })
  code: number;

  @ApiProperty({ example: '成功' })
  message: string;

  @ApiProperty({ type: () => Object, nullable: true })
  data?: T;

  constructor(options: { code: number; message: string; data?: T }) {
    this.code = options.code;
    this.message = options.message;
    this.data = options.data;
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

/**
 * 生成带分页数据的 Swagger 响应类
 *
 * 使用示例：
 * @ApiResponse({ type: SwaggerPaginatedResponse(UserInfoResDto) })
 */
export function SwaggerPaginatedResponse<T>(
  itemClass: Type<T>, // 如 UserInfoResDto
): Type<unknown> {
  // ✅ 普通类（非 abstract），确保可被赋给 Type<T>
  class PaginatedResponse {
    @ApiProperty({
      description: '分页响应数据',
      required: true,
      allOf: [
        // 1. 引用通用分页结构 PaginationResDto
        { $ref: getSchemaPath(PaginationResDto) },
        // 2. 覆盖 list 字段，指定其元素类型
        {
          type: 'object',
          properties: {
            list: {
              type: 'array',
              items: { $ref: getSchemaPath(itemClass) },
              description: '数据列表',
            },
          },
        },
      ],
    })
    data!: PaginationResDto<T>; // 使用非空断言，因为我们只用于类型/Swagger 提示
  }

  // 💡 可选：美化类名，便于在 Swagger 或调试时识别
  Object.defineProperty(PaginatedResponse, 'name', {
    value: `Paginated${itemClass.name}Response`,
  });

  // ✅ 强制类型断言，满足 Type<unknown> 要求
  return PaginatedResponse as Type<unknown>;
}

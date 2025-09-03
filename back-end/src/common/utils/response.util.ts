import { ApiResponse } from '@/common/interfaces/api-response';

/**
 * 响应格式化工具类
 */
export class ResponseUtil {
  /**
   * 成功响应
   */
  static success<T>(data: T, message: string = '操作成功'): ApiResponse<T> {
    return {
      code: 200,
      message,
      data,
    };
  }

  /**
   * 分页响应
   */
  static page<T>(
    list: T[],
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    },
    message: string = '查询成功',
  ) {
    return this.success(
      {
        list,
        pagination,
      },
      message,
    );
  }

  /**
   * 创建成功响应
   */
  static created<T>(data: T, message: string = '创建成功'): ApiResponse<T> {
    return {
      code: 201,
      message,
      data,
    };
  }

  /**
   * 无内容响应
   */
  static noContent(message: string = '操作成功'): ApiResponse<null> {
    return {
      code: 204,
      message,
      data: null,
    };
  }

  /**
   * 错误响应
   */
  static error(message: string, code: number = 400): ApiResponse<null> {
    return {
      code,
      message,
      data: null,
    };
  }
}

/**
 * 数据转换工具类
 */
export class DataTransformer {
  /**
   * 移除对象中的敏感字段
   */
  static omitSensitiveFields<T extends Record<string, any>>(data: T, fields: (keyof T)[] = ['password']): Partial<T> {
    const result = { ...data };
    fields.forEach((field) => {
      delete result[field];
    });
    return result;
  }

  /**
   * 移除数组中对象的敏感字段
   */
  static omitSensitiveFieldsFromArray<T extends Record<string, any>>(
    data: T[],
    fields: (keyof T)[] = ['password'],
  ): Partial<T>[] {
    return data.map((item) => this.omitSensitiveFields(item, fields));
  }

  /**
   * 将null值转换为undefined（适合前端使用）
   */

  static nullToUndefined<T extends Record<string, any>>(data: T): T {
    const result = { ...data } as any;
    Object.keys(result).forEach((key) => {
      if (result[key] === null) {
        result[key] = undefined;
      }
    });
    return result;
  }

  /**
   * 将数组中对象的null值转换为undefined
   */
  static nullToUndefinedArray<T extends Record<string, any>>(data: T[]): T[] {
    return data.map((item) => this.nullToUndefined(item));
  }

  /**
   * 格式化用户数据（移除敏感信息并转换null值）
   */
  static formatUser<T extends Record<string, any>>(user: T): Partial<T> {
    const withoutPassword = this.omitSensitiveFields(user, ['password']);
    return this.nullToUndefined(withoutPassword as T);
  }

  /**
   * 格式化用户列表数据
   */
  static formatUserList<T extends Record<string, any>>(users: T[]): Partial<T>[] {
    return users.map((user) => this.formatUser(user));
  }
}

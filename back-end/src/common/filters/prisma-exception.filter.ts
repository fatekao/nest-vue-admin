import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * Prisma异常过滤器
 *
 * 专门处理Prisma客户端错误，将Prisma错误转换为适当的HTTP异常
 * 主要处理唯一性约束违反(P2002)和记录不存在(P2025)错误
 */
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  /**
   * 异常处理方法
   *
   * @param exception 捕获到的Prisma异常
   * @param host 参数宿主对象，用于获取请求和响应对象
   */
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 根据错误代码处理不同类型的Prisma错误
    switch (exception.code) {
      case 'P2002': // 唯一约束违反
        this.handleUniqueConstraintError(exception, response, request);
        break;
      case 'P2025': // 记录不存在
        this.handleRecordNotFoundError(exception, response, request);
        break;
      default:
        // 对于未处理的Prisma错误，抛出500错误
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '数据库操作失败',
          path: request.url,
          timestamp: new Date().toISOString(),
        });
    }
  }

  /**
   * 处理唯一约束违反错误
   *
   * @param error Prisma错误对象
   * @param response HTTP响应对象
   * @param request HTTP请求对象
   */
  private handleUniqueConstraintError(
    error: PrismaClientKnownRequestError,
    response: Response,
    request: Request,
  ): void {
    const targetField = error.meta?.target as string;

    const getPrismaFiedldName = (fieldName: string) => {
      return fieldName.match(/_([a-zA-Z0-9]+)_key$/)![1];
    };

    const target = getPrismaFiedldName(targetField);

    // 返回409冲突错误
    response.status(HttpStatus.CONFLICT).json({
      code: HttpStatus.CONFLICT,
      message: `${target}已存在`,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 处理记录不存在错误
   *
   * @param error Prisma错误对象
   * @param response HTTP响应对象
   * @param request HTTP请求对象
   */
  private handleRecordNotFoundError(error: PrismaClientKnownRequestError, response: Response, request: Request): void {
    // 返回404未找到错误
    response.status(HttpStatus.NOT_FOUND).json({
      code: HttpStatus.NOT_FOUND,
      message: '记录不存在',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response, Request } from 'express';
import { ErrorResponse } from '@/common/interfaces/api-response';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/**
 * 全局异常过滤器
 *
 * 捕获所有未处理的异常并返回统一的错误响应格式
 * 对于非HttpException类型的异常，返回500状态码
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  /**
   * 异常处理方法
   *
   * @param exception 捕获到的异常
   * @param host 参数宿主对象，用于获取请求和响应对象
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 处理错误响应
    const status = this.getHttpStatus(exception);
    const errorResponse = this.formatErrorResponse(exception, status, request);

    // 记录错误日志
    this.logger.error('过滤器错误', {
      statusCode: status,
      headers: request.headers,
      query: request.query,
      body: request.body as Record<string, unknown>,
      params: request.params,
      timestamp: new Date().toISOString(),
    });

    // 设置响应头并返回
    httpAdapter.reply(response, errorResponse, status);
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private formatErrorResponse(exception: unknown, status: number, request: Request): ErrorResponse {
    // 默认错误信息
    let message: string = '服务器错误';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      // 处理验证错误（如 ValidationPipe 抛出的错误）
      if (typeof response === 'object' && response !== null) {
        // 确保类型安全地访问message属性
        if ('message' in response && response.message !== undefined) {
          if (typeof response.message === 'string') {
            message = response.message;
          } else if (Array.isArray(response.message)) {
            message = response.message.join(',');
          } else {
            message = JSON.stringify(response.message);
          }
        } else {
          // 如果没有message属性，将整个响应转换为字符串
          message = JSON.stringify(response);
        }
      } else if (typeof response === 'string') {
        message = response;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // 根据错误代码处理不同类型的Prisma错误
      switch (exception.code) {
        case 'P2002': {
          // 唯一约束违反
          const targetField = exception.meta?.target as string;
          const name = targetField.match(/_([a-zA-Z0-9]+)_key$/)![1];
          message = `${name}已存在`;
          break;
        }
        case 'P2025':
          // 记录不存在
          message = '操作失败，记录不存在';
          break;
        default:
          // 对于未处理的Prisma错误，抛出500错误
          message = `数据库错误: ${exception.message}`;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = String(exception);
    }

    // 构建统一的错误响应格式
    return {
      code: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };
  }
}

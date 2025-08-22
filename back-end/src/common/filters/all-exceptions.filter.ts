import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '@/shared/logger/logger.service';

interface ErrorResponse {
  code: number;
  message: string;
  timestamp: string;
  path: string;
  details?: any;
}

/**
 * 全局异常过滤器
 *
 * 捕获所有未处理的异常并返回统一的错误响应格式
 * 对于非HttpException类型的异常，返回500状态码
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  /**
   * 异常处理方法
   *
   * @param exception 捕获到的异常
   * @param host 参数宿主对象，用于获取请求和响应对象
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 确定响应状态码
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 确定响应消息
    const message = exception instanceof HttpException ? exception.message : '服务器错误';

    // 获取异常的响应数据（如果有）
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    // 构造统一的错误响应格式
    const errorResponse: ErrorResponse = {
      code: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error('过滤器错误', {
      statusCode: status,
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
    });

    // 如果有详细的错误信息，添加到响应中
    if (exceptionResponse && typeof exceptionResponse === 'object' && 'errors' in exceptionResponse) {
      errorResponse.details = exceptionResponse.errors;
    }

    // 检查响应是否已经发送
    if (!response.headersSent) {
      response.status(status).json(errorResponse);
    }
  }
}

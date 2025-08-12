import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '@/modules/common/logger/logger.service';

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
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  /**
   * 异常处理方法
   *
   * @param exception 捕获到的异常
   * @param host 参数宿主对象，用于获取请求和响应对象
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 确定响应状态码
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 确定响应消息
    const message = exception instanceof HttpException ? exception.message : '服务器错误';

    // 记录日志
    const { headers, url, params, query, body, method } = request;
    this.logger.log('请求信息', { headers, url, params, query, body, method });
    this.logger.log('响应信息', { url, method, status, message, timestamp: new Date().toISOString() });

    // 构造统一的错误响应格式
    const errorResponse: ErrorResponse = {
      code: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    console.error('异常信息  !!!!', response);

    // 检查响应是否已经发送
    if (!response.headersSent) {
      response.status(status).json(errorResponse);
    }
  }
}

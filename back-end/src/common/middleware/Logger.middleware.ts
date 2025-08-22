import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '@/shared/logger/logger.service';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * HTTP请求日志中间件
 * 用于记录HTTP请求的相关信息，包括请求方法、URL、状态码、执行时间等
 * 根据状态码不同，将日志记录到不同的级别中
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  /**
   * 中间件处理函数
   * @param request Express请求对象
   * @param response Express响应对象
   * @param next 下一个中间件函数
   */
  use(request: Request, response: Response, next: NextFunction): void {
    request.headers['x-trace-id'] ||= uuidv4();

    const startTime = Date.now();

    const { ip, method, originalUrl, httpVersion, headers } = request;

    response.on('close', () => {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      const { statusCode } = response;

      // 获取用户代理信息
      const userAgent = headers['user-agent'] || 'Unknown';

      // 格式化日志信息
      const logMessage = `${dayjs().format('YYYY-MM-DD HH:mm:ss')} | ${ip} | ${method} | ${originalUrl} | HTTP/${httpVersion} | ${statusCode} | ${userAgent} | ${executionTime}ms`;

      // 根据状态码记录不同级别的日志
      if (statusCode >= 500) {
        this.logger.error(`日志中间件-错误: ${logMessage}`);
      } else if (statusCode >= 400) {
        this.logger.warn(`日志中间件-告警: ${logMessage}`);
      } else {
        this.logger.log(`日志中间件-信息: ${logMessage}`);
      }
    });

    next();
  }
}

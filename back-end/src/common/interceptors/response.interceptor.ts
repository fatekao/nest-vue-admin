import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request } from 'express';

import { ApiResponse } from '@/common/dto/response.dto';
import { LoggerService } from '@/shared/logger/logger.service';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly logger: LoggerService) {}
  /**
   * 拦截请求并统一处理响应格式
   *
   * @param context 执行上下文
   * @param next 调用处理器
   * @returns 包装后的统一响应格式
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { headers, method, url, params, query, body } = request;
    this.logger.log('请求信息-拦截器', { headers, method, url, params, query, body: body as Record<string, any> });
    return next.handle().pipe(
      tap((data: T) =>
        this.logger.log('响应信息-拦截器', {
          url,
          method,
          status: 200,
          msg: '请求成功',
          data,
        }),
      ),
      map((data) => ({ code: 200, message: '请求成功', data })),
    );
  }
}

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RedisService } from '@/modules/common/redis/redis.service';
import { RepeatSubmitOptions } from '../decorators/repeat-submit.decorator';
import { REPEAT_SUBMIT_METADATA } from '../constants/decorator.constant';

@Injectable()
export class RepeatSubmitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const option = this.reflector.get<RepeatSubmitOptions>(REPEAT_SUBMIT_METADATA, context.getHandler());
    if (!option) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || 'guest';
    const key = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    const method = req.method;
    const url = req.url;
    const body = req.body ? JSON.stringify(req.body) : '';
    const repeatKey = option.keyGenerator
      ? option.keyGenerator(context)
      : `repeat_submit:${key}:${method}:${url}:${body}`;
    const interval = option.interval ?? 3000;

    const result = await this.redis.set(repeatKey, '1', interval);
    if (!result) {
      let msg: string | undefined;
      if (option && typeof option.message === 'function') {
        msg = (option.message as unknown as (ctx: ExecutionContext) => string)(context);
      } else {
        msg = option?.message as string;
      }
      throw new ForbiddenException(msg || '请勿重复提交');
    }
    return true;
  }
}

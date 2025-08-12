import { SetMetadata, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REPEAT_SUBMIT_METADATA } from '../constants/decorator.constant';

export interface RepeatSubmitOptions {
  interval?: number; // 重复提交的时间间隔，单位为毫秒
  message?: string | ((context: ExecutionContext) => string); // 提示信息或动态消息
  keyGenerator?: (context: ExecutionContext) => string; // 自定义生成唯一键的函数
}

export const RepeatSubmit = (options?: RepeatSubmitOptions) => {
  const defaultOptions: RepeatSubmitOptions = {
    interval: 3000, // 默认3秒
    message: '请勿重复提交',
    keyGenerator: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest<Request>();
      const authHeader = req.headers['authorization'] || req.headers['Authorization'] || 'guest';
      const key = Array.isArray(authHeader) ? authHeader[0] : authHeader;
      const method = req.method;
      const url = req.url;
      const body = req.body ? JSON.stringify(req.body) : '';
      return `repeat_submit:${key}:${method}:${url}:${body}`;
    },
  };
  // 合并时优先使用 options.keyGenerator/message/interval
  const finalOptions: RepeatSubmitOptions = {
    ...defaultOptions,
    ...options,
    keyGenerator: options?.keyGenerator || defaultOptions.keyGenerator,
    message: options?.message ?? defaultOptions.message,
    interval: options?.interval ?? defaultOptions.interval,
  };
  return SetMetadata(REPEAT_SUBMIT_METADATA, finalOptions);
};

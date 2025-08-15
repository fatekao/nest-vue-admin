import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';

/**
 * 日志服务类
 *
 * 基于 Winston 实现的日志服务，提供日志记录功能，包括:
 * 1. 控制台输出（带颜色）
 * 2. 按日期轮转的文件日志
 * 3. 支持不同日志级别
 * 4. 开发环境和生产环境的不同配置
 */
@Injectable()
export class LoggerService {
  private readonly logger: Logger;
  constructor() {
    this.logger = createLogger({
      // 默认日志级别
      level: 'info',

      // 默认日志格式
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ message, timestamp, level, ...metadata }) => {
          let logMessage = `${String(timestamp)} [${String(level)}]: ${String(message)}`;

          // 如果有额外的元数据，则添加到日志中
          if (Object.keys(metadata).length > 0) {
            // 避免重复输出 message 字段
            if (metadata['message'] !== message) {
              logMessage += `\n${JSON.stringify(metadata, null, 2)}`;
            }
          }

          return logMessage;
        }),
      ),

      // 日志传输器配置
      transports: [
        // 控制台输出配置
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),

        // 每日轮转文件配置
        new transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log', // 日志文件名模式
          datePattern: 'YYYY-MM-DD', // 日期格式
          zippedArchive: true, // 是否压缩旧日志
          maxSize: '20m', // 单个日志文件最大大小
          maxFiles: '14d', // 保留日志文件的天数
          // 根据环境设置日志级别
          level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',

          // 文件日志格式
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message, ...meta }) => {
              return `${String(timestamp)} ${String(level)}: ${String(message)} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            }),
          ),
        }),
      ],
    });
  }

  /**
   * 记录日志（通用方法）
   *
   * @param message 日志消息
   * @param params 可选的额外参数
   */
  log(message: string, params: object = {}): void {
    if (typeof params === 'object' && Object.keys(params).length > 0) {
      const logMessage = {
        message,
        ...params,
        level: 'info',
      };
      this.logger.log(logMessage);
    } else {
      this.logger.log({ message, level: 'info' });
    }
  }

  /**
   * 记录错误级别日志
   *
   * @param message 日志消息
   * @param params 可选的额外参数
   */
  error(message: string, params?: any): void {
    this.logger.error(message, { params });
  }

  /**
   * 记录警告级别日志
   *
   * @param message 日志消息
   * @param params 可选的额外参数
   */
  warn(message: string, params?: any): void {
    this.logger.warn(message, { params });
  }

  /**
   * 记录信息级别日志
   *
   * @param message 日志消息
   * @param params 可选的额外参数
   */
  info(message: string, params?: any): void {
    this.logger.info(message, { params });
  }

  /**
   * 记录调试级别日志
   *
   * @param message 日志消息
   * @param params 可选的额外参数
   */
  debug(message: string, params?: any): void {
    this.logger.debug(message, { params });
  }
}

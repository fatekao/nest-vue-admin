import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
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
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      // 默认日志级别
      level: 'info',

      // 默认日志格式
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.errors({ stack: true }),
        format.printf(({ message, timestamp, level, stack, ...metadata }) => {
          let logMessage = `${String(timestamp)} [${String(level).toUpperCase()}]: ${String(message)}`;

          // 如果有错误堆栈信息，则添加到日志中
          if (stack) {
            logMessage += `\n${stack}`;
          }

          // 如果有额外的元数据，则添加到日志中
          if (Object.keys(metadata).length > 0) {
            logMessage += `\n${JSON.stringify(metadata, null, 2)}`;
          }

          return logMessage;
        }),
      ),

      // 日志传输器配置
      transports: [
        // 控制台输出配置
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            format.printf(({ message, timestamp, level, stack, ...metadata }) => {
              let logMessage = `${String(timestamp)} [${String(level).toUpperCase()}]: ${String(message)}`;

              // 如果有错误堆栈信息，则添加到日志中
              if (stack) {
                logMessage += `\n${stack}`;
              }

              // 如果有额外的元数据，则添加到日志中
              if (Object.keys(metadata).length > 0) {
                logMessage += `\n${JSON.stringify(metadata, null, 2)}`;
              }

              return logMessage;
            }),
          ),
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
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            format.errors({ stack: true }),
            format.printf(({ timestamp, level, message, stack, ...meta }) => {
              let logMessage = `${String(timestamp)} [${String(level).toUpperCase()}]: ${String(message)}`;

              // 如果有错误堆栈信息，则添加到日志中
              if (stack) {
                logMessage += `\n${stack}`;
              }

              // 如果有额外的元数据，则添加到日志中
              if (Object.keys(meta).length > 0) {
                logMessage += `\n${JSON.stringify(meta, null, 2)}`;
              }

              return logMessage;
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
   * @param optionalParams 可选的额外参数
   */
  log(message: any, ...optionalParams: any[]): void {
    if (typeof message === 'string') {
      this.logger.info(message, ...optionalParams);
    } else {
      this.logger.info('Log message:', message, ...optionalParams);
    }
  }

  /**
   * 记录错误级别日志
   *
   * @param message 日志消息
   * @param optionalParams 可选的额外参数，可以包含错误堆栈和上下文信息
   */
  error(message: any, ...optionalParams: any[]): void {
    // 处理不同的参数组合
    if (optionalParams.length >= 2) {
      // 假设格式为 error(message, stack, context)
      const [stack, context] = optionalParams;
      this.logger.error(message, { stack, context });
    } else if (optionalParams.length === 1) {
      // 可能是堆栈或上下文
      const param = optionalParams[0];
      this.logger.error(message, { param });
    } else {
      // 没有额外参数
      this.logger.error(message);
    }
  }

  /**
   * 记录警告级别日志
   *
   * @param message 日志消息
   * @param optionalParams 可选的额外参数
   */
  warn(message: any, ...optionalParams: any[]): void {
    if (typeof message === 'string') {
      this.logger.warn(message, ...optionalParams);
    } else {
      this.logger.warn('Warning message:', message, ...optionalParams);
    }
  }

  /**
   * 记录信息级别日志
   *
   * @param message 日志消息
   * @param optionalParams 可选的额外参数
   */
  info(message: any, ...optionalParams: any[]): void {
    if (typeof message === 'string') {
      this.logger.info(message, ...optionalParams);
    } else {
      this.logger.info('Info message:', message, ...optionalParams);
    }
  }

  /**
   * 记录调试级别日志
   *
   * @param message 日志消息
   * @param optionalParams 可选的额外参数
   */
  debug?(message: any, ...optionalParams: any[]): void {
    if (typeof message === 'string') {
      this.logger.debug(message, ...optionalParams);
    } else {
      this.logger.debug('Debug message:', message, ...optionalParams);
    }
  }

  /**
   * 记录详细级别日志
   *
   * @param message 日志消息
   * @param optionalParams 可选的额外参数
   */
  verbose?(message: any, ...optionalParams: any[]): void {
    if (typeof message === 'string') {
      this.logger.verbose(message, ...optionalParams);
    } else {
      this.logger.verbose('Verbose message:', message, ...optionalParams);
    }
  }
}

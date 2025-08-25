import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException, HttpStatus } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * 参数验证管道
 * 用于验证传入请求的参数是否符合 DTO 类的定义
 */
@Injectable()
export class ParamsVerifyPipe implements PipeTransform {
  /**
   * 管道转换方法
   * @param value 传入的参数值
   * @param metadata 参数元数据
   * @returns 验证通过后的参数值
   */
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    // 如果没有元数据类型或者不需要验证，则直接返回原始值
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    // 将普通对象转换为指定类的实例，以便进行验证
    const object = plainToInstance(metadata.metatype, value, {
      enableImplicitConversion: true,
    });
    // 使用 class-validator 对转换后的实例进行验证
    const errors = await validate(object);

    console.log('###### TRANSFORM DEBUG ######');
    console.log('Input value:', value);
    console.log('Converted object:', object);
    console.log('Metadata metatype:', metadata.metatype);

    // 如果存在验证错误，则抛出异常
    if (errors.length > 0) {
      throw new BadRequestException(this.handlerError(errors));
    }

    // 验证通过
    return object;
  }

  /**
   * 判断是否需要验证
   * @param metatype 元数据类型
   * @returns 是否需要验证
   */
  private toValidate(metatype): boolean {
    // 定义不需要验证的基本类型
    const types = [String, Boolean, Number, Array, Object];

    console.log(`Metatype ${metatype} needs validation: `);

    // 如果类型不在基本类型中，则需要验证
    return !types.includes(metatype);
  }

  /**
   * 处理验证错误
   * @param errors 验证错误数组
   * @returns 格式化后的错误信息
   */
  private handlerError(errors: ValidationError[]) {
    // 格式化错误信息，只保留属性名和约束信息
    const formattedErrors = errors.map((error) => {
      const { constraints, property } = error;
      return { property, constraints };
    });

    // 返回统一的错误响应格式
    return {
      code: HttpStatus.BAD_REQUEST,
      message: '参数验证失败',
      errors: formattedErrors,
    };
  }
}

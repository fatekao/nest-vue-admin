import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { QueryBuilder, BatchOperations } from '@/common/utils/query.util';

/**
 * 基础服务类
 * 提供通用的CRUD操作和数据处理方法
 */
@Injectable()
export abstract class BaseService<T = any, CreateDto = any, UpdateDto = any> {
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * 抽象属性，子类需要实现
   */
  protected abstract model: any;
  protected abstract entityName: string;

  /**
   * 处理Prisma唯一约束错误
   */
  protected handleUniqueConstraintError(error: PrismaClientKnownRequestError): never {
    const targetField = error.meta?.target;
    let message = '该信息已存在';

    if (typeof targetField === 'string') {
      if (targetField.includes('username')) {
        message = '用户名已被注册';
      } else if (targetField.includes('email')) {
        message = '邮箱已被注册';
      } else if (targetField.includes('phone')) {
        message = '手机号已被注册';
      } else if (targetField.includes('name')) {
        message = '名称已存在';
      } else if (targetField.includes('key')) {
        message = '标识符已存在';
      }
    }
    throw new ConflictException(message);
  }

  /**
   * 处理Prisma错误
   */
  protected handlePrismaError(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': // 唯一约束违反
          this.handleUniqueConstraintError(error);
        case 'P2025': // 记录不存在
          throw new NotFoundException(`${this.entityName}不存在`);
        default:
          throw error;
      }
    }
    throw error;
  }

  /**
   * 创建记录
   */
  async create(createDto: CreateDto, createBy?: number): Promise<T> {
    try {
      const data = {
        ...createDto,
        ...(createBy && { createBy, updateBy: createBy }),
      };

      return await this.model.create({ data });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  /**
   * 根据ID查找记录
   */
  async findById(id: number, include?: any): Promise<T | null> {
    const where = QueryBuilder.buildSoftDeleteWhere({ id });
    return await this.model.findUnique({
      where,
      ...(include && { include }),
    });
  }

  /**
   * 根据ID查找记录，不存在则抛出异常
   */
  async findByIdOrThrow(id: number, include?: any): Promise<T> {
    const record = await this.findById(id, include);
    if (!record) {
      throw new NotFoundException(`${this.entityName}不存在`);
    }
    return record;
  }

  /**
   * 查找所有记录
   */
  async findAll(where?: any, include?: any, orderBy?: any): Promise<T[]> {
    const condition = QueryBuilder.buildSoftDeleteWhere(where);
    return await this.model.findMany({
      where: condition,
      ...(include && { include }),
      ...(orderBy && { orderBy }),
    });
  }

  /**
   * 分页查询
   */
  async findPage(page: number = 1, pageSize: number = 10, where?: any, include?: any, orderBy?: any) {
    const condition = QueryBuilder.buildSoftDeleteWhere(where);
    const pagination = QueryBuilder.buildPagination(page, pageSize);

    const [list, total] = await Promise.all([
      this.model.findMany({
        where: condition,
        ...pagination,
        ...(include && { include }),
        ...(orderBy && { orderBy }),
      }),
      this.model.count({ where: condition }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      list,
      pagination: {
        total,
        totalPages,
        page,
        pageSize,
      },
    };
  }

  /**
   * 更新记录
   */
  async update(id: number, updateDto: UpdateDto, updateBy?: number): Promise<T> {
    try {
      const data = {
        ...updateDto,
        updateTime: new Date(),
        ...(updateBy && { updateBy }),
      };

      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  /**
   * 软删除记录
   */
  async softDelete(id: number, updateBy?: number): Promise<T> {
    return await this.update(
      id,
      {
        isDeleted: true,
      } as any,
      updateBy,
    );
  }

  /**
   * 批量软删除
   */
  async batchSoftDelete(ids: number[], updateBy?: number): Promise<{ count: number }> {
    return await BatchOperations.batchSoftDelete(this.model, ids, updateBy);
  }

  /**
   * 批量更新状态
   */
  async batchUpdateStatus(ids: number[], status: number, updateBy?: number): Promise<{ count: number }> {
    return await BatchOperations.batchUpdateStatus(this.model, ids, status, updateBy);
  }

  /**
   * 检查记录是否存在
   */
  async exists(id: number): Promise<boolean> {
    const count = await this.model.count({
      where: QueryBuilder.buildSoftDeleteWhere({ id }),
    });
    return count > 0;
  }

  /**
   * 统计记录数量
   */
  async count(where?: any): Promise<number> {
    const condition = QueryBuilder.buildSoftDeleteWhere(where);
    return await this.model.count({ where: condition });
  }
}

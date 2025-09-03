/**
 * 数据库查询优化工具类
 */
export class QueryBuilder {
  /**
   * 构建分页查询参数
   */
  static buildPagination(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    return {
      skip,
      take: pageSize,
    };
  }

  /**
   * 构建软删除查询条件
   */
  static buildSoftDeleteWhere(additionalWhere: Record<string, any> = {}) {
    return {
      ...additionalWhere,
      isDeleted: false,
    };
  }

  /**
   * 构建用户查询的默认包含关系
   */
  static buildUserInclude() {
    return {
      roles: {
        where: { isDeleted: false, status: 0 },
        select: {
          id: true,
          name: true,
          key: true,
          status: true,
        },
      },
    };
  }

  /**
   * 构建权限查询的默认包含关系
   */
  static buildPermissionInclude() {
    return {
      roles: {
        where: { isDeleted: false, status: 0 },
        include: {
          permissions: {
            where: { isDeleted: false },
            orderBy: { orderNum: 'asc' },
            select: {
              id: true,
              name: true,
              type: true,
              path: true,
              component: true,
              icon: true,
              permission: true,
              orderNum: true,
              isVisible: true,
              parentId: true,
            },
          },
        },
      },
    };
  }

  /**
   * 构建模糊查询条件
   */
  static buildLikeCondition(field: string, value?: string) {
    if (!value) return {};
    return {
      [field]: {
        contains: value,
      },
    };
  }

  /**
   * 构建范围查询条件
   */
  static buildRangeCondition(field: string, start?: Date, end?: Date): Record<string, any> {
    const condition: Record<string, any> = {};
    if (start || end) {
      condition[field] = {};
      if (start) condition[field].gte = start;
      if (end) condition[field].lte = end;
    }
    return condition;
  }
}

/**
 * 缓存键生成器
 */
export class CacheKeyBuilder {
  private static readonly PREFIX = {
    USER: 'user',
    ROLE: 'role',
    PERMISSION: 'permission',
    MENU: 'menu',
    TOKEN: 'token',
  } as const;

  /**
   * 生成用户缓存键
   */
  static userKey(userId: number): string {
    return `${this.PREFIX.USER}:${userId}`;
  }

  /**
   * 生成用户权限缓存键
   */
  static userPermissionKey(userId: number): string {
    return `${this.PREFIX.USER}:${userId}:permissions`;
  }

  /**
   * 生成用户菜单缓存键
   */
  static userMenuKey(userId: number): string {
    return `${this.PREFIX.USER}:${userId}:menus`;
  }

  /**
   * 生成Token缓存键
   */
  static tokenKey(username: string, userId: number): string {
    return `${this.PREFIX.TOKEN}:${username}:${userId}`;
  }

  /**
   * 生成角色缓存键
   */
  static roleKey(roleId: number): string {
    return `${this.PREFIX.ROLE}:${roleId}`;
  }
}

/**
 * 批量操作工具类
 */
export class BatchOperations {
  /**
   * 批量删除（软删除）
   */
  static batchSoftDelete(model: any, ids: number[], updatedBy?: number): Promise<{ count: number }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return model.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isDeleted: true,
        updateTime: new Date(),
        ...(updatedBy && { updateBy: updatedBy }),
      },
    });
  }

  /**
   * 批量更新状态
   */
  static batchUpdateStatus(model: any, ids: number[], status: number, updatedBy?: number): Promise<{ count: number }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return model.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status,
        updateTime: new Date(),
        ...(updatedBy && { updateBy: updatedBy }),
      },
    });
  }
}

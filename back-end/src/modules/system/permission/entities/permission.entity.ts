export interface Permission {
  id: number;
  name: string;
  type: number;
  parentId?: number | null;
  parent?: Permission | null;
  children?: Permission[];
  path?: string | null;
  component?: string | null;
  icon?: string | null;
  permission?: string | null;
  orderNum: number;
  isVisible: boolean;
  isCacheable: boolean;
  isDeleted: boolean;
  createTime?: Date | null;
  updateTime?: Date | null;
  createBy?: number | null;
  updateBy?: number | null;
  roles?: { id: number }[];
  [key: string]: any; // 允许其他动态属性，因为Prisma可能会返回额外字段
}

// 权限实体接口（与基础Permission接口保持一致）
export interface PermissionEntity {
  id: number;
  name: string;
  type: number;
  parentId?: number | null;
  parent?: Permission | null;
  children?: Permission[];
  path?: string | null;
  component?: string | null;
  icon?: string | null;
  permission?: string | null;
  orderNum: number;
  isVisible: boolean;
  isCacheable: boolean;
  isDeleted: boolean;
  createTime?: Date | null;
  updateTime?: Date | null;
  createBy?: number | null;
  updateBy?: number | null;
  roles?: { id: number }[];
  [key: string]: any; // 允许其他动态属性，因为Prisma可能会返回额外字段
}

// 权限树形结构实体
export interface PermissionTreeEntity extends Permission {
  children?: PermissionTreeEntity[];
}

// 简化的权限实体（用于关联查询）
export interface PermissionSimpleEntity {
  id: number;
  name: string;
  type: number;
  path?: string | null;
  component?: string | null;
  icon?: string | null;
  permission?: string | null;
  orderNum: number;
  isVisible: boolean;
  parentId?: number | null;
  [key: string]: any;
}

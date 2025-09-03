/**
 * 用户状态枚举
 */
export enum UserStatus {
  DISABLED = 0, // 禁用
  NORMAL = 1, // 正常
  LOCKED = 2, // 锁定
}

/**
 * 角色状态枚举
 */
export enum RoleStatus {
  NORMAL = 0, // 正常
  DISABLED = 1, // 停用
}

/**
 * 性别枚举
 */
export enum Gender {
  FEMALE = 0, // 女
  MALE = 1, // 男
}

/**
 * 权限资源类型枚举
 */
export enum PermissionType {
  DIRECTORY = 0, // 目录
  MENU = 1, // 菜单
  BUTTON = 2, // 按钮(权限点)
}

/**
 * 操作类型枚举
 */
export enum BusinessType {
  OTHER = 0, // 其它
  INSERT = 1, // 新增
  UPDATE = 2, // 修改
  DELETE = 3, // 删除
  GRANT = 4, // 授权
  EXPORT = 5, // 导出
  IMPORT = 6, // 导入
  FORCE = 7, // 强退
  GENCODE = 8, // 生成代码
  CLEAN = 9, // 清空数据
}

/**
 * 操作人类别枚举
 */
export enum OperatorType {
  OTHER = 0, // 其它
  MANAGE = 1, // 后台用户
  MOBILE = 2, // 手机端用户
}

/**
 * 登录状态枚举
 */
export enum LoginStatus {
  SUCCESS = '0', // 成功
  FAILED = '1', // 失败
}

/**
 * 操作状态枚举
 */
export enum OperStatus {
  SUCCESS = 0, // 成功
  FAIL = 1, // 失败
}

/**
 * 用户状态枚举
 * 对应数据库字段：sys_user.status
 * 0-禁用，1-正常，2-锁定
 */
export enum UserStatus {
  DISABLED = 0, // 禁用
  NORMAL = 1, // 正常
  LOCKED = 2, // 锁定
}

/**
 * 角色状态枚举
 * 对应数据库字段：sys_role.status
 * 0-正常，1-停用
 */
export enum RoleStatus {
  NORMAL = 0, // 正常
  DISABLED = 1, // 停用
}

/**
 * 性别枚举
 * 对应数据库字段：sys_user.gender
 * 1-男，0-女
 */
export enum Gender {
  FEMALE = 0, // 女
  MALE = 1, // 男
}

/**
 * 权限资源类型枚举
 * 对应数据库字段：sys_permission.type
 * 0-目录，1-菜单，2-按钮(权限点)
 */
export enum PermissionType {
  DIRECTORY = 0, // 目录
  MENU = 1, // 菜单
  BUTTON = 2, // 按钮(权限点)
}

/**
 * 业务操作类型枚举
 * 对应数据库字段：sys_oper_log.business_type
 * 0=其它,1=新增,2=修改,3=删除,4=授权,5=导出,6=导入,7=强退,8=生成代码,9=清空数据
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
 * 操作人员类别枚举
 * 对应数据库字段：sys_oper_log.operator_type
 * 0=其它,1=后台用户,2=手机端用户
 */
export enum OperatorType {
  OTHER = 0, // 其它
  BACKEND_USER = 1, // 后台用户
  MOBILE_USER = 2, // 手机端用户
}

/**
 * 操作状态枚举
 * 对应数据库字段：sys_oper_log.status
 * 0=正常,1=异常
 */
export enum OperationStatus {
  SUCCESS = 0, // 正常
  FAILED = 1, // 异常
}

/**
 * 登录状态枚举
 * 对应数据库字段：sys_login_log.status
 * 0=成功,1=失败
 */
export enum LoginStatus {
  SUCCESS = '0', // 成功
  FAILED = '1', // 失败
}

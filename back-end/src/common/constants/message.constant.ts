/**
 * 系统消息常量
 */
export const MESSAGES = {
  // 通用消息
  SUCCESS: '操作成功',
  FAILED: '操作失败',

  // 认证相关
  LOGIN_SUCCESS: '登录成功',
  LOGIN_FAILED: '登录失败',
  LOGOUT_SUCCESS: '退出成功',
  TOKEN_INVALID: 'Token无效',
  TOKEN_EXPIRED: 'Token已过期',
  UNAUTHORIZED: '未授权访问',

  // 用户相关
  USER_NOT_FOUND: '用户不存在',
  USER_DISABLED: '用户已被禁用',
  USER_LOCKED: '用户已被锁定',
  USERNAME_EXISTS: '用户名已存在',
  EMAIL_EXISTS: '邮箱已存在',
  PHONE_EXISTS: '手机号已存在',
  PASSWORD_INCORRECT: '密码错误',
  OLD_PASSWORD_INCORRECT: '原密码错误',
  PASSWORD_RESET_SUCCESS: '密码重置成功',
  PASSWORD_UPDATE_SUCCESS: '密码修改成功',

  // 角色相关
  ROLE_NOT_FOUND: '角色不存在',
  ROLE_NAME_EXISTS: '角色名称已存在',
  ROLE_KEY_EXISTS: '角色标识已存在',
  ROLE_IN_USE: '角色正在使用中，无法删除',

  // 权限相关
  PERMISSION_NOT_FOUND: '权限不存在',
  PERMISSION_DENIED: '权限不足',
  PERMISSION_NAME_EXISTS: '权限名称已存在',
  PERMISSION_KEY_EXISTS: '权限标识已存在',

  // 菜单相关
  MENU_NOT_FOUND: '菜单不存在',
  MENU_NAME_EXISTS: '菜单名称已存在',
  MENU_HAS_CHILDREN: '菜单存在子级，无法删除',

  // 数据验证
  INVALID_PARAMS: '参数错误',
  INVALID_ID: 'ID无效',
  REQUIRED_FIELD_MISSING: '必填字段缺失',

  // 文件操作
  FILE_UPLOAD_SUCCESS: '文件上传成功',
  FILE_UPLOAD_FAILED: '文件上传失败',
  FILE_NOT_FOUND: '文件不存在',
  FILE_SIZE_EXCEEDED: '文件大小超出限制',
  FILE_TYPE_NOT_SUPPORTED: '文件类型不支持',

  // 系统错误
  SYSTEM_ERROR: '系统错误',
  DATABASE_ERROR: '数据库错误',
  NETWORK_ERROR: '网络错误',
  SERVICE_UNAVAILABLE: '服务不可用',
} as const;

/**
 * HTTP状态码对应的消息
 */
export const HTTP_MESSAGES = {
  200: '请求成功',
  201: '创建成功',
  204: '无内容',
  400: '请求参数错误',
  401: '未授权',
  403: '禁止访问',
  404: '资源不存在',
  409: '资源冲突',
  422: '参数验证失败',
  429: '请求过于频繁',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
} as const;

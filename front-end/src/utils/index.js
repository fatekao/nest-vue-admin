/**
 * 深拷贝函数
 * @param {*} obj 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
export function deepClone(obj) {
  // 处理 null 和 undefined
  if (obj === null || obj === undefined) {
    return obj
  }

  // 处理基本数据类型
  if (typeof obj !== 'object') {
    return obj
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  // 处理正则表达式
  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item))
  }

  // 处理普通对象
  const cloned = {}
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }

  return cloned
}

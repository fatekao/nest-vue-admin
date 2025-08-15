/**
 * 将对象中的 null 值转换为 undefined
 * @param data 包含可能为 null 值的对象
 * @returns 将所有 null 值替换为 undefined 后的对象
 */
export const ObjNullToUndefined = (data: Record<string, any>) => {
  Object.keys(data).forEach((key) => {
    if (data[key] === null) {
      data[key] = undefined;
    }
  });
  return data;
};

/**
 * 将对象中的 undefined 值转换为 null
 * @param data 包含可能为 undefined 值的对象
 * @returns 将所有 undefined 值替换为 null 后的对象
 */
export const ObjUndefinedToNull = (data: Record<string, any>) => {
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      data[key] = null;
    }
  });
  return data;
};

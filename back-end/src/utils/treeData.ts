// src/utils/array-to-tree.util.ts

/**
 * 定义转换选项接口，使用 keyof T 约束 idKey 和 parentIdKey
 */
export interface ArrayToTreeOptions<T> {
  /**
   * 根节点的父 ID 值。
   * 默认为 0。
   */
  root?: string | number | null;

  /**
   * 父 ID 在节点对象中的键名。
   * 必须是 T 的键。
   */
  parentIdKey: keyof T;

  /**
   * 节点 ID 在节点对象中的键名。
   * 必须是 T 的键。
   */
  idKey: keyof T;

  /**
   * 子节点数组在结果对象中的键名。
   * 默认为 'children'。
   * 注意：此键可以是任意字符串，不强制是 T 的键，因为它是动态添加的。
   */
  childrenKey?: string; // 保持为 string
}

/**
 * 将扁平的节点数组转换为树形结构。
 * 使用 Map 优化查找性能 (O(n) 时间复杂度)。
 * 特点：只有当节点拥有子节点时，才会为其添加 `children` 属性。
 *
 * @param array 扁平的节点数组
 * @param options 转换选项，使用 keyof T 约束 idKey 和 parentIdKey
 * @returns 树形结构数组
 */
export function arrayToTree<T extends Record<string, any>>(array: T[], options: ArrayToTreeOptions<T>): T[] {
  const { root = 0, parentIdKey, idKey, childrenKey = 'children' } = options;

  // 使用 Map 存储节点，以 id 为键，实现 O(1) 查找
  const nodeMap = new Map<any, T & Record<string, any>>();
  const roots: (T & Record<string, any>)[] = [];

  // 1. 初始化所有节点到 Map 中 (不包含 children)
  array.forEach((item) => {
    nodeMap.set(item[idKey], { ...item }); // item[idKey] 安全，idKey 是 keyof T
  });

  // 2. 构建父子关系
  array.forEach((item) => {
    const id = item[idKey]; // 安全：idKey 是 keyof T
    const node = nodeMap.get(id);
    if (!node) return; // 安全检查

    const parentId = item[parentIdKey]; // 安全：parentIdKey 是 keyof T

    if (parentId === root) {
      // 是根节点
      roots.push(node);
    } else {
      // 不是根节点，查找父节点
      const parent = nodeMap.get(parentId);
      if (parent) {
        // --- 关键修改点：处理 dynamic key access and assignment ---
        // 确保父节点有 children 数组
        if (!Object.prototype.hasOwnProperty.call(parent, childrenKey)) {
          (parent as Record<string, any>)[childrenKey] = [];
        }
        // 获取 children 数组
        // 我们知道 parent[childrenKey] 应该是数组，但 TS/ESLint 因动态访问标记为 any
        const childrenArray = parent[childrenKey] as T[];

        // 运行时类型检查：确保它是一个数组后再操作
        if (Array.isArray(childrenArray)) {
          // 此时我们知道 childrenArray 是数组，可以安全调用 push
          childrenArray.push(node); // 直接调用，无需额外断言
        } else {
          // 处理意外情况（理论上不应发生）
          console.warn(`Property '${childrenKey}' on parent node is unexpectedly not an array.`, parent);
        }
        // --- 修改结束 ---
      }
      // 如果找不到父节点，该节点被忽略
    }
  });

  return roots as T[];
}

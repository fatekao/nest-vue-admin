/**
 * 一个通用的树节点接口，用于表示具有层级结构的数据。
 * 它扩展了泛型类型 T，意味着它包含了 T 的所有属性，
 * 并额外添加了一个可选的用于存储子节点的数组属性。
 *
 * @template T - 原始扁平数据项的类型。
 * @template ChildrenKey - 子节点数组属性的键名，默认为 'children'。
 */
export type HierarchicalTreeNode<T extends Record<string, any>, ChildrenKey extends string = 'children'> = T & {
  // 使用映射类型和条件类型来动态定义可选的 children 属性
  // [K in ChildrenKey]?: HierarchicalTreeNode<T, ChildrenKey>[] | undefined;
  // 或者更直接地，因为 K 只有一个值 (ChildrenKey)
  // 但我们想让属性名就是 ChildrenKey 的值，并且是可选的
  // 最清晰的方式是使用带可选修饰符的索引签名或 Record
  // 但为了精确映射键名，使用这种方式：
} & { [k in ChildrenKey]?: HierarchicalTreeNode<T, ChildrenKey>[] };

export type TreeKey = string | number;

export interface ArrayToTreeOptions<T> {
  root?: TreeKey; // 根节点的父级 ID 值，默认为 0
  idKey?: keyof T; // 节点唯一标识符的键名，默认为 'id'
  parentKey?: keyof T; // 父节点标识符的键名，默认为 'parentId'
  childrenKey?: string; // 子节点数组的键名，默认为 'children'
  includeNoRoot?: boolean; // 是否包含找不到父节点的孤立节点，默认为 false
}

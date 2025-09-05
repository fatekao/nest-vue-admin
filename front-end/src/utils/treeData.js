/**
 * 将扁平数组扁平化处理，提取所有节点（包括子节点）
 * @param {Array} tree - 树形结构数组
 * @param {string} childrenKey - 子节点的键名，默认为 'children'
 * @returns {Array} 扁平化后的数组
 */
export function flattenTree(tree, childrenKey = 'children') {
  if (!Array.isArray(tree)) {
    console.warn('flattenTree: 输入参数必须是数组')
    return []
  }

  const result = []

  function traverse(arr) {
    if (!Array.isArray(arr)) return

    arr.forEach((item) => {
      if (!item || typeof item !== 'object') return

      const { [childrenKey]: children, ...data } = item
      result.push(data)

      if (children && Array.isArray(children) && children.length > 0) {
        traverse(children)
      }
    })
  }

  traverse(tree)
  return result
}

/**
 * 清理和转换树形数据，对每个节点应用回调函数进行处理
 * @param {Array} tree - 树形结构数组
 * @param {Function} callback - 处理每个节点的回调函数
 * @param {string} childrenKey - 原子节点的键名，默认为 'children'
 * @param {string} newChildrenKey - 新子节点的键名，默认为 'children'
 * @returns {Array} 处理后的树形结构数组
 */
export function cleanTree(tree, callback, childrenKey = 'children', newChildrenKey = 'children') {
  if (!Array.isArray(tree)) {
    console.warn('cleanTree: 输入参数必须是数组')
    return []
  }

  if (typeof callback !== 'function') {
    console.warn('cleanTree: callback 必须是函数')
    return tree
  }

  const traverse = (nodes) => {
    if (!Array.isArray(nodes)) return []

    const result = []

    nodes.forEach((node) => {
      if (!node || typeof node !== 'object') return

      const { [childrenKey]: children, ...item } = node

      try {
        const newNode = callback(item)

        if (children && Array.isArray(children) && children.length > 0) {
          const processedChildren = traverse(children)
          if (processedChildren.length > 0) {
            newNode[newChildrenKey] = processedChildren
          }
        }

        result.push(newNode)
      } catch (error) {
        console.warn('cleanTree: 处理节点时发生错误', error, item)
      }
    })

    return result
  }

  return traverse(tree)
}

/**
 * 将扁平数组转换为树形结构（高性能版本）
 * 使用 Map 优化查找性能，时间复杂度为 O(n)
 * @param {Array} array - 扁平数组
 * @param {Object} options - 配置选项
 * @param {string|number} options.root - 根节点的父ID值，默认为 0
 * @param {string} options.idKey - 节点ID的键名，默认为 'id'
 * @param {string} options.parentIdKey - 父节点ID的键名，默认为 'parentId'
 * @param {string} options.childrenKey - 子节点数组的键名，默认为 'children'
 * @returns {Array} 树形结构数组
 */
export function arrayToTree(array, options = {}) {
  if (!Array.isArray(array)) {
    console.warn('arrayToTree: 输入参数必须是数组')
    return []
  }

  const { root = 0, idKey = 'id', parentIdKey = 'parentId', childrenKey = 'children' } = options

  // 使用 Map 存储节点，实现 O(1) 查找
  const nodeMap = new Map()
  const roots = []

  // 1. 初始化所有节点到 Map 中
  array.forEach((item) => {
    if (!item || typeof item !== 'object') return

    const id = item[idKey]
    if (id !== undefined && id !== null) {
      nodeMap.set(id, { ...item })
    }
  })

  // 2. 构建父子关系
  array.forEach((item) => {
    if (!item || typeof item !== 'object') return

    const id = item[idKey]
    const parentId = item[parentIdKey]
    const node = nodeMap.get(id)

    if (!node) return

    if (parentId === root || parentId === undefined || parentId === null) {
      // 是根节点
      roots.push(node)
    } else {
      // 查找父节点
      const parent = nodeMap.get(parentId)
      if (parent) {
        // 确保父节点有 children 数组
        if (!parent[childrenKey]) {
          parent[childrenKey] = []
        }
        parent[childrenKey].push(node)
      }
    }
  })

  return roots
}

/**
 * 在树形结构中查找节点
 * @param {Array} tree - 树形结构数组
 * @param {Function} predicate - 查找条件函数
 * @param {string} childrenKey - 子节点的键名，默认为 'children'
 * @returns {Object|null} 找到的节点或 null
 */
export function findNode(tree, predicate, childrenKey = 'children') {
  if (!Array.isArray(tree) || typeof predicate !== 'function') {
    return null
  }

  function search(nodes) {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue

      if (predicate(node)) {
        return node
      }

      const children = node[childrenKey]
      if (children && Array.isArray(children) && children.length > 0) {
        const found = search(children)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  return search(tree)
}

/**
 * 过滤树形结构，保留符合条件的节点及其祖先节点
 * @param {Array} tree - 树形结构数组
 * @param {Function} predicate - 过滤条件函数
 * @param {string} childrenKey - 子节点的键名，默认为 'children'
 * @returns {Array} 过滤后的树形结构数组
 */
export function filterTree(tree, predicate, childrenKey = 'children') {
  if (!Array.isArray(tree) || typeof predicate !== 'function') {
    return []
  }

  function filter(nodes) {
    const result = []

    nodes.forEach((node) => {
      if (!node || typeof node !== 'object') return

      const { [childrenKey]: children, ...nodeData } = node
      let shouldInclude = predicate(node)
      let filteredChildren = []

      if (children && Array.isArray(children) && children.length > 0) {
        filteredChildren = filter(children)
        // 如果有符合条件的子节点，也要包含当前节点
        if (filteredChildren.length > 0) {
          shouldInclude = true
        }
      }

      if (shouldInclude) {
        const newNode = { ...nodeData }
        if (filteredChildren.length > 0) {
          newNode[childrenKey] = filteredChildren
        }
        result.push(newNode)
      }
    })

    return result
  }

  return filter(tree)
}

/**
 * 获取树的最大深度
 * @param {Array} tree - 树形结构数组
 * @param {string} childrenKey - 子节点的键名，默认为 'children'
 * @returns {number} 树的最大深度
 */
export function getTreeDepth(tree, childrenKey = 'children') {
  if (!Array.isArray(tree) || tree.length === 0) {
    return 0
  }

  let maxDepth = 0

  function traverse(nodes, depth = 1) {
    maxDepth = Math.max(maxDepth, depth)

    nodes.forEach((node) => {
      if (!node || typeof node !== 'object') return

      const children = node[childrenKey]
      if (children && Array.isArray(children) && children.length > 0) {
        traverse(children, depth + 1)
      }
    })
  }

  traverse(tree)
  return maxDepth
}

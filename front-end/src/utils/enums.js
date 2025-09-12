export default {
  user: {
    gender: [
      { label: '女', value: 0 },
      { label: '男', value: 1 }
    ],
    status: [
      { label: '禁用', value: 0 },
      { label: '正常', value: 1 },
      { label: '锁定', value: 2 }
    ]
  },
  role: {
    status: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 }
    ]
  },
  permission: {
    type: [
      { label: '目录', value: 0 },
      { label: '菜单', value: 1 },
      { label: '按钮', value: 2 }
    ]
  },
  business: {
    type: [
      { label: '其它', value: 0 },
      { label: '新增', value: 1 },
      { label: '修改', value: 2 },
      { label: '删除', value: 3 },
      { label: '授权', value: 4 },
      { label: '导出', value: 5 },
      { label: '导入', value: 6 },
      { label: '强退', value: 7 },
      { label: '生成代码', value: 8 },
      { label: '清空数据', value: 9 }
    ]
  },
  operator: {
    type: [
      { label: '其它', value: 0 },
      { label: '后台用户', value: 1 },
      { label: '手机端用户', value: 2 }
    ]
  },
  operation: {
    status: [
      { label: '正常', value: 0 },
      { label: '异常', value: 1 }
    ]
  },
  login: {
    status: [
      { label: '成功', value: '0' },
      { label: '失败', value: '1' }
    ]
  }
}

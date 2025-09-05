<script setup>
import { getUserPage } from '@/api/user'
const table = reactive({
  data: [],
  columns: [
    { label: '用户名', value: 'username' },
    { label: '昵称', value: 'nickName' },
    {
      label: '性别',
      value: 'gender',
      type: 'enum',
      enum: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ]
    },
    { label: '邮箱', value: 'email' },
    { label: '手机号码', value: 'phone' },
    { label: '头像', value: 'avatar' },
    { label: '手机号', value: 'phone' },
    { label: '最后登录IP', value: 'lastLoginIp' },
    { label: '最后登录时间', value: 'lastLoginTime' },
    { label: '创建时间', value: 'createTime' },
    { label: '创建人', value: 'createUser' },
    { label: '备注', value: 'remark' }
  ],
  actions: {
    label: '操作',
    list: [
      { label: '编辑', click: (row) => editItem(row) },
      { label: '删除', type: 'danger' }
    ]
  },
  searchs: [{ label: '昵称' }],
  searchForm: {
    input: '',
    page: 1,
    pageSize: 10,
    total: 0
  }
})

const editItem = (row) => {
  console.log('editItem')
  console.log(row)
}

onMounted(() => {
  getUserPage(table.searchForm).then((res) => {
    table.data = res.data.list
  })
})
</script>

<template>
  <FtCard title="用户管理" class="single">
    <FtTable :data="table.data" :columns="table.columns" :actions="table.actions" :searchs="table.searchs"></FtTable>
  </FtCard>
</template>

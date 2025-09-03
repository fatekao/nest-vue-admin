<script setup>
const table = reactive({
  data: [],
  columns: [
    { label: '用户名', value: 'username' },
    {
      label: '一级表头',
      children: [
        { label: '昵称', value: 'nickname' },
        { label: '邮箱', value: 'email' }
      ]
    },
    { label: '手机号', value: 'phone' },
    { label: '状态', value: 'status' }
  ],
  actions: {
    label: '操作',
    list: [
      { label: '编辑', click: (row) => editItem(row) },
      { label: '删除', type: 'danger' }
    ]
  },
  searchs: [{ label: '昵称' }]
})

const editItem = (row) => {
  console.log('editItem')
  console.log(row)
}

onMounted(() => {
  table.data = [
    { username: 'admin', nickname: '管理员', email: 'admin@admin.com', phone: '12345678901', status: '正常' },
    { username: 'user', nickname: '用户', email: 'user@user.com', phone: '12345678901', status: '正常' }
  ]
})
</script>

<template>
  <FtCard title="用户管理" class="single">
    <FtTable :data="table.data" :columns="table.columns" :actions="table.actions" :searchs="table.searchs"></FtTable>
  </FtCard>
</template>

<style lang="scss" scoped>
* {
  color: #00658d;
}
</style>

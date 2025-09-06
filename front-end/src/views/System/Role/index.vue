<script setup>
import enums from '@/utils/enums'
import { getRolePage } from '@/api/role'
const table = reactive({
  data: [],
  columns: [
    { label: '角色名称', value: 'name' },
    { label: '角色标识', value: 'key' },
    {
      label: '状态',
      value: 'status',
      type: 'enum',
      options: enums.role.status
    },
    { label: '创建时间', value: 'createTime', type: 'date' },
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
  getRolePage(table.searchForm).then((res) => {
    table.data = res.data.list
  })
})
</script>

<template>
  <FtCard title="角色管理" class="single">
    <FtTable :data="table.data" :columns="table.columns" :actions="table.actions" :searchs="table.searchs"></FtTable>
  </FtCard>
</template>

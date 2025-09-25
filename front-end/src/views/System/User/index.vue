<script setup>
import { Edit } from './components'
import { getRoleList } from '@/api/role'
import { getUserPage, deleteUser } from '@/api/user'
import enums from '@/utils/enums'

const table = reactive({
  data: [],
  columns: [
    { label: '用户名', value: 'username', attrs: { width: '100px' } },
    { label: '昵称', value: 'nickName', attrs: { width: '100px' } },
    { label: '性别', value: 'gender', type: 'enum', options: enums.user.gender, attrs: { width: 60 } },
    { label: '邮箱', value: 'email' },
    { label: '手机号码', value: 'phone', attrs: { width: '120px' } },
    { label: '头像', value: 'avatar', type: 'image', attrs: { width: '80px' } },
    { label: '最后登录IP', value: 'lastLoginIp', attrs: { width: '120px' } },
    { label: '最后登录时间', value: 'lastLoginTime', type: 'date', attrs: { width: 160 } },
    { label: '创建时间', value: 'createTime', type: 'date', attrs: { width: 160 } },
    { label: '创建人', value: 'createByName', attrs: { width: 100 } },
    { label: '备注', value: 'remark', attrs: { width: 160 } }
  ],
  actions: {
    label: '操作',
    list: [
      { label: '编辑', value: 'system:user:edit', click: (row) => editItem(row) },
      { label: '删除', value: 'system:user:delete', type: 'danger', click: (row) => deleteItem(row.id) }
    ]
  },
  search: {
    list: [
      { label: '模糊搜索', value: 'keyword' },
      {
        label: '角色',
        value: 'roleId',
        type: 'select',
        attrs: {
          options: [],
          props: { label: 'name', value: 'id' },
          clearable: true
        }
      }
    ],
    form: {
      roleId: '',
      keyword: '',
      page: 1,
      pageSize: 10,
      total: 0
    }
  }
})
const editRef = useTemplateRef('editRef')
const addItem = () => {
  editRef.value.openDialog('add')
}
const deleteItem = (id) => {
  deleteUser({ id }).then(() => {
    ElMessage.success('删除成功')
    search()
  })
}
const editItem = (row) => {
  editRef.value.openDialog('edit', row)
}

onMounted(() => {
  search()
  getRoleList().then((res) => {
    table.search.list[1].attrs.options = res.data
  })
})

const search = () => {
  getUserPage(table.search.form).then((res) => {
    table.data = res.data.list
    table.search.form.total = res.data.total
  })
}
</script>

<template>
  <FtCard title="用户管理" class="single">
    <FtTable
      show-overflow-tooltip
      filter
      local="user"
      :data="table.data"
      :columns="table.columns"
      v-model:search="table.search.form"
      :actions="table.actions"
      @search="search"
    >
      <template #username="{ row }">
        <span>{{ row.username }}11</span>
      </template>
      <FtTableSearch :options="table.search.list"></FtTableSearch>
      <FtTablePagination></FtTablePagination>
      <template #control>
        <el-button type="primary" @click="addItem">添加</el-button>
      </template>
    </FtTable>
    <Edit ref="editRef" @search="search"></Edit>
  </FtCard>
</template>

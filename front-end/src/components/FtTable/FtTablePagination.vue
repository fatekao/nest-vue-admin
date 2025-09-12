<script setup name="FtTablePagination">
const model = defineModel()

const tableSearch = inject('tableSearch')

const pageChange = () => {
  nextTick(() => {
    tableSearch()
  })
}
</script>

<template>
  <el-pagination
    v-model:page-size="model.pageSize"
    v-model:current-page="model.page"
    :total="model.total"
    @change="pageChange"
    :page-sizes="[10, 20, 50, 100]"
    background
    layout="total, prev, pager, next, jumper, ->, sizes"
  ></el-pagination>
</template>

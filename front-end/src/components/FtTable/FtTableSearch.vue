<script setup name="FtTableSearch">
import FormItem from '../Common/FormItem.vue'
import { deepClone } from '@/utils'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  initSearchForm: {
    type: Object,
    default: null
  }
})

const model = defineModel()

const tableSearch = inject('tableSearch')

const handleSearch = () => {
  nextTick(() => {
    tableSearch()
  })
}

const handleReset = () => {
  const { page: oldPage, pageSize: oldPageSize } = model.value
  const { page: newPage, pageSize: newPageSize } = props.initSearchForm

  model.value = deepClone(props.initSearchForm)

  // 重置后如果页码和页容量相同，则手动触发一次搜索，否则通过分页组件自动触发搜索
  if (oldPage === newPage && oldPageSize === newPageSize) {
    nextTick(() => {
      tableSearch(model.value)
    })
  }
}
</script>

<template>
  <div class="ft-table-search">
    <template v-for="(item, index) in options" :key="index">
      <div class="ft-table-search-item">
        <div class="label">{{ item.label }}</div>
        <div class="content">
          <FormItem v-model="model[item.value]" style="min-width: 100px" :type="item.type" :attrs="item.attrs"> </FormItem>
        </div>
      </div>
    </template>
    <div class="ft-table-search-item">
      <el-button type="primary" @click="handleSearch">
        <template #icon>
          <FtIcon name="search"></FtIcon>
        </template>
        查询
      </el-button>
      <el-button @click="handleReset">
        <template #icon>
          <FtIcon name="reset"></FtIcon>
        </template>
        重置
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ft-table-search {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 12px;
  .ft-table-search-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
    .label {
      margin-right: 10px;
    }
  }
}
</style>

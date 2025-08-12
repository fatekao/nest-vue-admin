<script setup>
import FormItem from '../Common/FormItem.vue'
defineProps({
  searchs: {
    type: Array
  }
})

const emits = defineEmits(['search'])
const handleSearch = () => {
  emits('search', searchs)
}
</script>

<template>
  <div class="ft-table-search">
    <template v-for="(item, index) in searchs" :key="index">
      <div class="ft-table-search-item">
        <div class="label">{{ item.label }}</div>
        <div class="content">
          <FormItem v-model:value="item.value" v-bind="$attrs"></FormItem>
        </div>
      </div>
      <div class="ft-table-search-item">
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </template>
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

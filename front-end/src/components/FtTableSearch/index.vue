<script setup name="FtTableSearch">
import FormItem from '../Common/FormItem.vue'

defineProps({
  options: {
    type: Array,
    default: () => []
  }
})

const model = defineModel()

const emits = defineEmits(['search'])

const handleSearch = () => {
  emits('search', model.value)
}
</script>

<template>
  <div class="ft-table-search">
    <template v-for="(item, index) in options" :key="index">
      <div class="ft-table-search-item">
        <div class="label">{{ item.label }}</div>
        <div class="content">
          <FormItem v-model="model[item.value]" :type="item.type" :options="item.options"> </FormItem>
        </div>
      </div>
    </template>
    <div class="ft-table-search-item">
      <el-button type="primary" @click="handleSearch">查询</el-button>
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

<script setup name="FtTableActions">
defineProps({
  label: {
    type: String
  },
  list: {
    type: Object
  }
})
</script>

<template>
  <el-table-column :label="label || '操作'">
    <template #default="scope">
      <template v-for="(item, index) in list" :key="index">
        <el-link :type="item.type || 'primary'" underline="never" @click="item.click(scope.row, item)">{{ item.label }}</el-link>
      </template>
    </template>
  </el-table-column>
</template>

<style lang="scss" scoped>
.el-link:not(:last-child) {
  margin-right: 10px;
}
</style>

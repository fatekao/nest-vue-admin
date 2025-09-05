<script setup name="FtTable">
import FtTableColumn from './FtTableColumn.vue'
import FtTableActions from './FtTableActions.vue'
import FtTableSearch from './FtTableSearch.vue'
defineProps({
  data: {
    type: Array,
    default: () => [],
    required: true
  },
  columns: {
    type: Array,
    default: () => [],
    required: true
  },
  actions: Object,
  searchs: {
    type: Array
  }
})
</script>

<template>
  <div class="ft-table">
    <div class="table-before">
      <FtTableSearch v-if="searchs" :searchs></FtTableSearch>
    </div>
    <el-table :data="data" v-bind="$attrs">
      <template v-for="(item, index) in columns" :key="index">
        <FtTableColumn :config="item" :idx="index"></FtTableColumn>
      </template>
      <FtTableActions v-if="actions" v-bind="actions"></FtTableActions>
    </el-table>
    <div class="table-after"></div>
  </div>
</template>

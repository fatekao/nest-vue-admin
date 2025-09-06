<script setup name="FtTable">
import FtTableColumn from './FtTableColumn.vue'
import FtTableActions from './FtTableActions.vue'

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
  },
  border: {
    type: Boolean,
    default: true
  }
})

const slots = useSlots().default?.() || []

const components = reactive({
  ftTableSearch: null
})

onBeforeMount(() => {
  slots.forEach((vnode, index) => {
    console.log('table vnode', vnode)
    const compnentName = vnode.type.name
    switch (compnentName) {
      case 'FtTableSearch':
        if (!components.ftTableSearch) {
          components.ftTableSearch = vnode
        } else {
          console.warn('FtTableSearch组件只能有一个')
        }
        break
    }
  })
})
</script>

<template>
  <div class="ft-table">
    <div class="table-before">
      <component v-if="components.ftTableSearch" :is="components.ftTableSearch" />
    </div>
    <el-table :data="data" v-bind="$attrs" :border>
      <template v-for="(item, index) in columns" :key="index">
        <FtTableColumn :config="item" :idx="index"></FtTableColumn>
      </template>
      <FtTableActions v-if="actions" v-bind="actions"></FtTableActions>
    </el-table>
    <div class="table-after"></div>
  </div>
</template>

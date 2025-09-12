<script setup name="FtTable">
import FtTableColumn from './FtTableColumn.vue'
import FtTableActions from './FtTableActions.vue'
import FtTableFilterSort from './FtTableFilterSort.vue'
import { deepClone } from '@/utils'

const props = defineProps({
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
  },
  filter: {
    type: Boolean,
    default: false
  },
  local: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const searchForm = defineModel('search')

const initSearchForm = ref(null)

const slots = useSlots().default?.() || []

const components = reactive({
  ftTableSearch: null,
  ftTableControl: null
})

const filterSorts = ref([])

onBeforeMount(() => {
  if (searchForm.value) {
    initSearchForm.value = deepClone(searchForm.value)
  }

  slots.forEach((vnode) => {
    const compnentName = vnode.type.name
    switch (compnentName) {
      case 'FtTableSearch':
        if (!components.ftTableSearch) {
          components.ftTableSearch = vnode
        } else {
          console.warn('FtTableSearch组件只能有一个')
        }
        break
      case 'FtTablePagination':
        if (!components.FtTablePagination) {
          components.FtTablePagination = vnode
        } else {
          console.warn('FtTablePagination组件只能有一个')
        }
        break
    }
  })
  filterSorts.value = props.columns
})

const emits = defineEmits(['search'])
provide('tableSearch', () => {
  emits('search', searchForm.value)
})
</script>

<template>
  <div class="ft-table">
    <div class="ft-table-before">
      <component v-if="components.ftTableSearch" :is="components.ftTableSearch" v-model="searchForm" :initSearchForm="initSearchForm" />

      <div v-if="slots.control || filter" class="ft-table-control">
        <slot name="control"></slot>
        <FtTableFilterSort :local v-model:columns="filterSorts"></FtTableFilterSort>
      </div>
    </div>
    <el-table :data="data" v-bind="$attrs" :border>
      <template v-for="item in filterSorts" :key="item.value">
        <FtTableColumn v-if="item.visible !== false" :config="item"></FtTableColumn>
      </template>
      <FtTableActions v-if="actions" v-bind="actions"></FtTableActions>
    </el-table>
    <div class="ft-table-after">
      <component v-if="components.FtTablePagination" :is="components.FtTablePagination" v-model="searchForm" v-bind="$attrs" />
    </div>
  </div>
</template>

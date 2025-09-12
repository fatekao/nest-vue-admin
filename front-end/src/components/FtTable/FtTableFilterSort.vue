<script setup>
import Sortable from 'sortablejs'
import { nextTick } from 'vue'
const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
    required: true
  },
  local: {
    type: String,
    default: ''
  }
})
const finalTableId = `ft-table-${props.local}`

const localColumns = defineModel('columns')
const initColumns = ref([])

let sortableInstance = null

onMounted(() => {
  initColumns.value = props.columns
  initLocalColumns()
  initSortable()
})

onBeforeUnmount(() => {
  if (sortableInstance) {
    sortableInstance.destroy()
  }
  if (props.local) {
    localStorage.setItem(finalTableId, JSON.stringify(localColumns.value))
  }
})

// 初始化排序数组
const initLocalColumns = () => {
  const temp = localStorage.getItem(finalTableId)
  if (props.local && temp) {
    localColumns.value = JSON.parse(temp)
  } else {
    resetColumns()
  }
}

const listRef = useTemplateRef('listRef')

const initSortable = () => {
  sortableInstance = Sortable.create(listRef.value, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    filter: '.sortable-disabled',
    onEnd: (evt) => {
      const { newIndex, oldIndex } = evt
      if (oldIndex !== newIndex) {
        nextTick(() => {
          const newColumns = [...localColumns.value]
          const [movedItem] = newColumns.splice(oldIndex, 1)
          newColumns.splice(newIndex, 0, movedItem)

          localColumns.value = newColumns
          localStorage.setItem(finalTableId, JSON.stringify(newColumns))
        })
      }
    }
  })
}

const resetColumns = () => {
  localColumns.value = initColumns.value.map((item) => {
    return {
      ...item,
      visible: true
    }
  })
  if (props.local) {
    nextTick(() => {
      localStorage.setItem(finalTableId, JSON.stringify(localColumns.value))
    })
  }
}
</script>

<template>
  <el-popover>
    <template #reference>
      <el-button>
        <template #icon>
          <FtIcon name="filter"></FtIcon>
        </template>
      </el-button>
    </template>
    <div class="ft-table-filter-sort">
      <div class="filter-sort-header">
        <el-link type="primary" underline="never" @click="resetColumns">重置</el-link>
      </div>
      <div class="filter-sort-body" ref="listRef">
        <template v-for="item in localColumns" :key="item.label + item.value">
          <div class="filter-sort-item">
            <div class="drag-handler">
              <FtIcon name="drag"></FtIcon>
            </div>
            <span class="filter-sort-label">{{ item.label }}</span>
            <el-checkbox v-model="item.visible" />
          </div>
        </template>
      </div>
    </div>
  </el-popover>
</template>

<style lang="scss" scoped>
.filter-sort-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .drag {
    width: 20px;
  }
  .filter-sort-label {
    flex: 1;
  }
}
</style>

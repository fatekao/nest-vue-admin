<script setup name="FtTableColumn">
import FtTableItem from './FtTableItem.vue'
const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})
const { value, label, children } = props.config
const slots = useSlots()
</script>

<template>
  <el-table-column :prop="value" :label>
    <template #header>
      <slot :name="`${value}-header`" :label>
        {{ label }}
      </slot>
    </template>
    <template #default="scope">
      <template v-if="children && children.length">
        <FtTableColumn v-for="(item, index) in children" :key="index" v-bind="item" :props="scope.row">
          <template v-for="slot in Object.keys(slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
          </template>
        </FtTableColumn>
      </template>
      <template v-else>
        <slot :name="value" v-bind="scope">
          <FtTableItem :scope :config="props.config"></FtTableItem>
        </slot>
      </template>
    </template>
  </el-table-column>
</template>

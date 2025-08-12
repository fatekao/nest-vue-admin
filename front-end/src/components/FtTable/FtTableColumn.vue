<script setup name="FtTableColumn">
defineProps({
  label: {
    type: String,
    default: '',
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  idx: {
    type: Number,
    default: 0
  },
  props: {
    type: Object
  },
  children: Array
})
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
        <slot :name="value" :scope :props> {{ scope.row[value] }} </slot>
      </template>
    </template>
  </el-table-column>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'input'
  },
  default: {
    type: [String, Number, Boolean, Object, Array],
    default: ''
  },
  attrs: {
    type: Object,
    default: () => ({})
  }
})

const model = defineModel('model', { type: [String, Number, Boolean, Object, Array], default: '' })
</script>

<template>
  <template v-if="type === 'input'">
    <el-input v-model="model" v-bind="attrs" />
  </template>
  <template v-else-if="type === 'select'">
    <el-select v-model="model" v-bind="attrs"> </el-select>
  </template>
  <template v-else-if="type === 'checkbox'">
    <el-checkbox v-model="model" v-bind="attrs" />
  </template>
  <template v-else-if="type === 'radio'">
    <el-radio v-model="model" v-bind="attrs" />
  </template>
  <template v-else-if="type === 'switch'">
    <el-switch v-model="model" v-bind="attrs" />
  </template>
  <template v-else-if="type === 'date'">
    <el-date-picker v-model="model" v-bind="attrs" />
  </template>
</template>

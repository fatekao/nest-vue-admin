<script setup name="FtTableItem">
import dayjs from 'dayjs'
const props = defineProps({
  scope: {
    type: Object,
    required: true
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

// 格式化显示值
function getDisplayValue() {
  const fieldValue = props.scope.row[props.config.value]
  // 根据列配置的类型进行格式化
  switch (props.config.type) {
    case 'date':
      return formatDate(fieldValue, props.config.format)
    case 'enum':
      return getEnumLabel(fieldValue, props.config.options)
    case 'image':
      return getImageUrl(fieldValue)
    default:
      return fieldValue
  }
}

// 日期格式化
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  return dayjs(date).format(format)
}

// 枚举值转换
function getEnumLabel(value, enumOptions) {
  if (!enumOptions || !Array.isArray(enumOptions)) return value
  const option = enumOptions.find((item) => item.value === value)
  return option ? option.label : value
}

// 图片地址转换
function getImageUrl(value) {
  if (!value) return ''
  return value
}
</script>

<template>
  <!-- 图片类型 -->
  <el-image
    v-if="props.config.type === 'image'"
    :src="getDisplayValue()"
    :preview-src-list="[getDisplayValue()]"
    fit="cover"
    style="width: 50px; height: 50px; border-radius: 4px"
    :preview-teleported="true"
  >
    <template #error>
      <div class="image-error">
        <FtIcon name="image-error"></FtIcon>
      </div>
    </template>
  </el-image>
  <span v-else class="ft-table-text">{{ getDisplayValue() }}</span>
</template>

<style scoped>
.ft-table-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ft-table-text {
  word-break: break-word;
  line-height: 1.4;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}
</style>

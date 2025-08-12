<script setup name="FtIcon">
const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true
  },
  size: {
    type: [String, Number],
    default: '24'
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  // 未找到图标时是否占位
  placeholder: {
    type: Boolean,
    default: false
  }
})

const svgStyle = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    fill: props.color
  }
})

// 批量获取svg文件地址，配合vite-svg-loader，将svg文件转为组件
const svgModules = import.meta.glob('@/assets/icons/**/*.svg', { query: '?component' })

// svg缓存映射器
const svgIconMap = {}

// 提取svg文件名并进行映射
Object.keys(svgModules).forEach((path) => {
  const iconName = path.replace('/src/assets/icons/', '').replace('.svg', '').replace(/\//g, '-')
  svgIconMap[iconName] = svgModules[path]
})

// 异步组件形式加载svg
const iconComponent = computed(() => {
  const name = props.name
  if (!name || !svgIconMap[name]) {
    console.warn(`图标 ${name} 未找到`)
    return null
  }
  const svgIcon = defineAsyncComponent(svgIconMap[name])
  return svgIcon
})
</script>

<template>
  <Suspense>
    <template #default>
      <component v-if="iconComponent" :is="iconComponent" :style="svgStyle" v-bind="$attrs" class="ft-icon" />
      <div v-else-if="props.placeholder" :style="svgStyle" v-bind="$attrs" class="ft-icon placeholder"></div>
    </template>
    <template #fallback>
      <div class="ft-icon placeholder" :style="svgStyle"></div>
    </template>
  </Suspense>
</template>

<style lang="scss" scoped>
.ft-icon {
  display: inline-block;
  vertical-align: middle;
  &.placeholder {
    display: inline-block;
    vertical-align: middle;
    background-color: #ccc;
  }
}
</style>

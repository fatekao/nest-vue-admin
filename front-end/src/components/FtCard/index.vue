<script setup name="FtCard">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  }
})

const slots = useSlots()
</script>

<template>
  <div class="ft-card">
    <div v-if="props.title || slots.extra" class="ft-card__header">
      <div v-if="props.title" class="ft-card__title">
        <span class="title">{{ props.title }}</span>
        <span class="sub-title">{{ props.subTitle }}</span>
      </div>
      <div v-if="slots.extra" class="ft-card__extra">
        <slot name="extra"></slot>
      </div>
    </div>
    <div class="ft-card__body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ft-card {
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: var(--el-bg-color);
  &.single {
    height: calc(100vh - $gAppHeaderHeight - 20px);
  }
  &:not(:last-child) {
    margin-bottom: 16px;
  }
  .ft-card__header {
    width: 100%;
    height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid var(--el-border-color);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ft-card__title {
      .title {
        height: 18px;
        line-height: 18px;
        border-left: 3px solid var(--el-color-primary);
        padding-left: 8px;
        color: var(--el-text-color-primary);
      }
      .sub-title {
        height: 14px;
        line-height: 14px;
        color: var(--el-text-color-secondary);
      }
    }
    .ft-card__extra {
      margin-left: auto;
    }
  }
  .ft-card__body {
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>

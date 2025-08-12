<script setup>
import MenuItem from './MenuItem.vue'
import { innerRoutes } from '@/router/config'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const route = useRoute()

const activeMenu = computed(() => {
  return route.meta.activePath || route.path
})
const arrow = computed(() => {
  return appStore.siderCollapse ? 'arrow-right' : 'arrow-left'
})
</script>

<template>
  <div class="g-app-sider-container" :class="{ collapse: appStore.siderCollapse }">
    <ElScrollbar type="vertical">
      <ElMenu :default-active="activeMenu" :collapse="appStore.siderCollapse">
        <MenuItem :menus="innerRoutes"></MenuItem>
      </ElMenu>
    </ElScrollbar>
    <div class="g-app-sider-collapse-bar" @click="appStore.toggleSiderCollapse">
      <FtIcon :name="arrow"></FtIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.g-app-sider-container {
  position: relative;
  height: 100%;
  width: 200px;
  transition: width 0.3s ease-in-out;
  border-right: 1px solid #ebebeb;
  box-sizing: border-box;
  &.collapse {
    width: 64px;
  }
  .g-app-sider-collapse-bar {
    position: absolute;
    width: 20px;
    height: 50px;
    top: 50%;
    right: -20px;
    z-index: 10;
    border-right: 1px solid #ebebeb;
    border-radius: 0 8px 8px 0;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
  }
  :deep(.el-menu) {
    border: none;
    .el-menu-item,
    .el-sub-menu__title {
      height: 36px;
      line-height: 36px;
      .el-icon {
        margin-right: 0;
      }
      .nav-title {
        margin-left: 5px;
      }
    }
    .is-active > .el-sub-menu__title {
    }
  }
}
</style>

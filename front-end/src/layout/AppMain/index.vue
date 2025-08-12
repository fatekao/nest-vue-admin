<template>
  <div class="g-app-main-container">
    <ElScrollbar>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </ElScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.g-app-main-container {
  padding: 10px;
  box-sizing: border-box;
  flex: 1;
  overflow: hidden;
  background-color: #f5f5f5;
}
</style>

<template>
  <div class="g-app-container">
    <AppHeader />
    <div class="g-app-container-main">
      <AppSider />
      <AppMain />
    </div>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader/index.vue'
import AppSider from './AppSider/index.vue'
import AppMain from './AppMain/index.vue'
</script>

<style lang="scss" scoped>
.g-app-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.g-app-container-main {
  width: 100vw;
  height: calc(100vh - $gAppHeaderHeight);
  display: flex;
}
</style>

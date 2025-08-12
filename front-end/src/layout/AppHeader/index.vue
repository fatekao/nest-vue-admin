<script setup>
import VueLogo from '@/assets/images/vue.svg'

const router = useRouter()
const messageHandler = () => {
  ElMessage.success('点击了消息')
  linkTo('/message')
}

const linkTo = (link) => {
  router.push(link)
}
</script>

<template>
  <div class="g-app-header-container">
    <div class="left">
      <ElImage :src="VueLogo" alt="logo" class="logo" />
      <ElDivider direction="vertical"></ElDivider>
      <div class="g-app-name" @click="linkTo('/')">后台管理系统</div>
    </div>
    <div class="right">
      <FtIcon name="bell" @click="messageHandler"></FtIcon>
      <ElDivider direction="vertical"></ElDivider>
      <ElAvatar :src="VueLogo" alt="avatar" class="avatar"></ElAvatar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.g-app-header-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $gAppHeaderHeight;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  .left {
    display: flex;
    align-items: center;
    .logo {
      width: 30px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
    }
  }
}
</style>

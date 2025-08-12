<script setup>
defineProps({
  menus: {
    type: Array,
    default: () => []
  }
})
const hasChild = (val) => {
  return val.children && val.children.length > 0
}

const router = useRouter()
const linkTo = (link) => {
  router.push(link)
}
</script>

<template>
  <template v-for="item in menus" :key="item.path">
    <ElSubMenu v-if="hasChild(item)" :index="item.path">
      <template #title>
        <FtIcon :name="item.meta.icon" size="20" class="el-icon"></FtIcon>
        <span class="nav-title sub-nav-title">{{ item.meta.title }}</span>
      </template>
      <MenuItem :menus="item.children"></MenuItem>
    </ElSubMenu>
    <ElMenuItem v-else-if="item.meta?.visible !== false" :index="item.path" @click="linkTo(item.path)">
      <FtIcon v-if="item.meta.icon" :name="item.meta.icon" class="el-icon" size="20"></FtIcon>
      <span class="nav-title">{{ item.meta.title }}</span>
    </ElMenuItem>
  </template>
</template>

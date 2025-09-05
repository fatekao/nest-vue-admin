import router from '@/router'
import { getTokenStorage } from '@/utils/webStorage'
import { isLocal } from '@/utils/helper'
import { ROUTES, AUTH } from '@/constants/app'
import { useUserStore } from './store'

/**
 * 设置页面标题
 * @param {string} title - 页面标题
 */
function setPageTitle(title) {
  document.title = title || 'nest-vue-admin'
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
function isAuthenticated() {
  return !!(getTokenStorage() || isLocal)
}

/**
 * 检查路由是否在白名单中
 * @param {string} path - 路由路径
 * @returns {boolean} 是否在白名单中
 */
function isInWhiteList(path) {
  return AUTH.WHITE_LIST.includes(path)
}

let routerIsLoaded = false

const loadDynamicRoutes = async () => {
  if (routerIsLoaded) return
  const userStore = useUserStore()
  await userStore.getUserInfo()
  routerIsLoaded = true
}

router.beforeEach(async (to, from, next) => {
  // 跳转到登录页
  if (to.path === '/login') {
    routerIsLoaded = false
  }

  // 白名单路由直接通过
  if (isInWhiteList(to.path)) {
    next()
    return
  }

  // 检查用户认证状态: 未登录，重定向到登录页
  if (!isAuthenticated()) {
    //
    next({
      path: ROUTES.LOGIN,
      query: to.path !== ROUTES.HOME ? { redirect: to.fullPath } : undefined
    })
    return
  }

  // 已登录，加载路由
  await loadDynamicRoutes()
  next()
})

router.afterEach((to) => {
  // 设置页面标题
  setPageTitle(to.meta?.title)
})

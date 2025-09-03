import router from '@/router'
import { getTokenStorage } from '@/utils/webStorage'
import { isLocal } from '@/utils/helper'
import { ROUTES, AUTH } from '@/constants/app'

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

/**
 * 检查路由是否存在
 * @param {object} route - 路由对象
 * @returns {boolean} 路由是否存在
 */
function isValidRoute(route) {
  return route.matched && route.matched.length > 0
}

router.beforeEach(async (to, from, next) => {
  try {
    // 设置页面标题
    setPageTitle(to.meta?.title)

    // 白名单路由直接通过
    if (isInWhiteList(to.path)) {
      next()
      return
    }

    // 检查用户认证状态
    if (!isAuthenticated()) {
      // 未登录，重定向到登录页
      next({
        path: ROUTES.LOGIN,
        query: to.path !== ROUTES.HOME ? { redirect: to.fullPath } : undefined
      })
      return
    }

    // 已登录，检查路由是否有效
    if (isValidRoute(to)) {
      next()
    } else {
      console.warn(`路由不存在: ${to.path}`)
      next(ROUTES.NOT_FOUND)
    }
  } catch (error) {
    console.error('路由守卫错误', error)
    next(ROUTES.LOGIN)
  }
})

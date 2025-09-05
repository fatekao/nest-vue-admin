import { getTokenStorage, getUserInfoStorage, setTokenStorage } from '@/utils/webStorage'
import { login, getUserInfo } from '@/api/common'
import { innerRoutes } from '@/router/config'
import { isLocal } from '@/utils/helper'
import { cleanTree, flattenTree } from '@/utils/treeData'

import router from '@/router'

const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: getUserInfoStorage,
    token: getTokenStorage,
    routes: [],
    buttons: []
  }),
  actions: {
    getUserInfo() {
      return new Promise((resolve) => {
        if (isLocal) {
          this.userInfo = {}
          this.buttons = []
          this.routes = [...innerRoutes]
        } else {
          getUserInfo().then((res) => {
            const { buttons, menus, ...userInfo } = res.data
            this.userInfo = userInfo
            this.buttons = buttons
            this.routes = cleanTree(menus, (item) => {
              return {
                path: item.path,
                name: item.name,
                meta: item.meta,
                component: () => import(`@/views/${item.component}.vue`)
              }
            })
          })
        }

        flattenTree(this.routes).forEach((item) => {
          router.addRoute('layout', item)
        })

        router.addRoute({
          path: '/:pathMatch(.*)',
          name: '404',
          redirect: '/404',
          component: () => import('@/views/Error/NotFound.vue')
        })
        resolve()
      })
    },
    setToken(token) {
      this.token = token
    },
    login(data) {
      return new Promise((resolve, reject) => {
        login(data)
          .then((res) => {
            this.token = res.data.accessToken
            setTokenStorage(this.token)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})

export default useUserStore

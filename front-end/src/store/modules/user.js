import { getTokenStorage, getUserInfoStorage } from '@/utils/webStorage'

const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: getUserInfoStorage,
    token: getTokenStorage,
    routes: [],
    buttons: []
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    setToken(token) {
      this.token = token
    }
  }
})

export default useUserStore

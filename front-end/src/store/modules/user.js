import { getTokenStorage, getUserInfoStorage, setTokenStorage } from '@/utils/webStorage'
import { login } from '@/api/common'

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

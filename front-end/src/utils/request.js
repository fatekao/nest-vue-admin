import axios from 'axios'

import { getTokenStorage } from '@/utils/webStorage'
import qs from 'qs'

const service = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api' : '',
  withCredentials: true,
  timeout: 60 * 1000
})

let isBlob = false

service.interceptors.request.use(
  (config) => {
    isBlob = config.responseType === 'blob'

    config.headers.Authorization = getTokenStorage()

    if (config.contentType === 'form') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (config.method === 'get') {
      config.paramsSerializer = (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }

    config.data = config.data || {}
    config.params = config.params || {}

    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => {
    if (isBlob) {
      return response
    }

    const res = response.data

    if (res.code !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 401: token 过期; 402: 异地登录;
      if (res.code === 401 || res.code === 402) {
        ElMessageBox.confirm('登录状态已失效，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const router = useRouter()
          router.push('/login')
        })
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  (error) => {
    ElMessage({
      message: error.message || '请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

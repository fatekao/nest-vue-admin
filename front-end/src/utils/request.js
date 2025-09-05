import axios from 'axios'
import router from '@/router'
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

    config.headers.Authorization = `Bearer ${getTokenStorage()}`

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
      errrorHandler(res.code, res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  (error) => {
    console.log(error)
    errrorHandler(error.status, error.response.data.message || error.message)
    return Promise.reject(error)
  }
)

export default service

const errrorHandler = (code, message) => {
  ElMessage({
    message: message || '请求失败',
    type: 'error',
    duration: 5 * 1000
  })
  if (code === 401 || code === 403) {
    ElMessageBox.confirm('登录状态已失效，请重新登录', '提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      router.push('/login')
    })
  }
}

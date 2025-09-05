import service from '@/utils/request'

export function login(data) {
  return service.request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return service.request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return service.request({
    url: '/auth/getUserInfo',
    method: 'get'
  })
}

import service from '@/utils/request'

export function login(data) {
  return service.request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return service.request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return service.request({
    url: '/user/info',
    method: 'get'
  })
}

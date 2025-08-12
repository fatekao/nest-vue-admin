import service from '@/utils/request'

export function getUserPage(params) {
  return service.request({
    url: '/user/page',
    method: 'get',
    params
  })
}

export function editUser(data) {
  return service.request({
    url: '/user/edit',
    method: 'post',
    data
  })
}

export function getUser(params) {
  return service.request({
    url: '/user/get',
    method: 'get',
    params
  })
}

export function deleteUser(data) {
  return service.request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

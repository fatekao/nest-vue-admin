import service from '@/utils/request'

export function getRolePage(params) {
  return service.request({
    url: '/system/role/page',
    method: 'get',
    params
  })
}

export function getRoleList(params) {
  return service.request({
    url: '/system/role/list',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return service.request({
    url: '/system/role/create',
    method: 'post',
    data
  })
}

export function editRole(data) {
  return service.request({
    url: '/system/role/update',
    method: 'post',
    data
  })
}

export function getRole(params) {
  return service.request({
    url: '/system/role/detail',
    method: 'get',
    params
  })
}

export function deleteRole(data) {
  return service.request({
    url: '/system/role/delete',
    method: 'post',
    data
  })
}

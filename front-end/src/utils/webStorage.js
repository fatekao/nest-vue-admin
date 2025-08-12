const type = import.meta.env.VITE_STORAGE_TYPE

export function getTokenStorage() {
  return window[type].getItem('token') ?? ''
}
export function setTokenStorage(token) {
  window[type].setItem('token', token)
}
export function getUserInfoStorage() {
  const data = window[type].getItem('userInfo') ?? '{}'
  return JSON.parse(data)
}
export function setUserInfoStorage(data) {
  const dataStr = JSON.stringify(data || {})
  window[type].setItem('userInfo', dataStr)
}

// 侧边栏开关
export function setSiderCollapseStorage(collapse) {
  window[type].setItem('siderCollapse', collapse)
}
export function getSiderCollapseStorage() {
  const collapse = window[type].getItem('siderCollapse')
  return collapse === 'true'
}

export function clearStorage() {
  window[type].clear()
}

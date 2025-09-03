const innerRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: '首页',
      icon: 'overview'
    }
  },
  {
    path: '/system',
    name: 'System',
    meta: {
      title: '系统设置',
      icon: 'setting'
    },
    children: [
      {
        path: '/system/user',
        name: 'User',
        component: () => import('@/views/System/User/index.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/system/role',
        name: 'Role',
        component: () => import('@/views/System/Role/index.vue'),
        meta: {
          title: '角色管理'
        }
      }
    ]
  }
]
export { innerRoutes }

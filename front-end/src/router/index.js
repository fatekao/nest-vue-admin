import { createRouter, createWebHistory } from 'vue-router'
import { innerRoutes } from './config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', name: 'layout', component: () => import('@/layout/index.vue'), children: innerRoutes }]
})

export default router

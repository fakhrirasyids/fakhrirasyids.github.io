import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/home/Home.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/not-found/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

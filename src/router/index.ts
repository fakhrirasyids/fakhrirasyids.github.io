import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/home/HomePage.vue'),
      },
      {
        path: 'experience',
        name: 'Experience',
        component: () => import('@/pages/experience/ExperiencePage.vue'),
      },
      {
        path: 'projects',
        name: 'Projects',
        component: () => import('@/pages/projects/ProjectsPage.vue'),
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('@/pages/articles/ArticlesPage.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/not-found/NotFoundPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

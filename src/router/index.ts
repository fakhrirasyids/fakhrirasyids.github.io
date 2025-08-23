import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
          path: 'projects/:id',
          name: 'ProjectDetail',
          component: () => import('@/pages/project-detail/ProjectDetailPage.vue'),
          props: true, // passes route.params.name as prop
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
  ],
})

export default router

import { databaseClient } from '@/database/implementation'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/programme',
      name: 'program',
      component: () => import('../views/program/ProgramView.vue'),
    },
    {
      path: '/themes/:themeUuid',
      name: 'themes',
      component: () => import('../views/theme/ThemeView.vue'),
    },
    {
      path: '/browse/:level?',
      name: 'browse',
      component: () => import('../views/BrowseView.vue'),
    },
    {
      path: '/repository/:content/:id',
      name: 'repository',
      component: () => import('../views/RepositoryView.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/TimelineView.vue'),
    },
    {
      path: '/dashboard/:view?',
      name: 'dashboard',
      component: () => import('@/views/dashboard/Dashboard.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/40x/40x.vue'),
    }
  ],
})

export default router

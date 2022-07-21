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
      path: '/profile',
      name: 'account',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/dashboard/:view?/:action?/:depo?',
      name: 'dashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
    },
  ],
})

export default router

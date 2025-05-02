import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Use dynamic imports for better code splitting
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/SignIn.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/episodes',
    name: 'Episodes',
    component: () => import('@/views/Episodes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/music',
    name: 'Music',
    component: () => import('@/views/Music.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('@/views/Games.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Add navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/sign-in')
  } else if (to.meta.requiresGuest && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
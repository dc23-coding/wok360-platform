import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import SignUp from '@/views/auth/SignUp.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Episodes from '@/views/Episodes.vue'
import Music from '@/views/Music.vue'
import Games from '@/views/Games.vue'
import ShopPage from '@/views/ShopPage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home }, // Public
  { path: '/login', name: 'Login', component: Login },
  { path: '/sign-up', name: 'SignUp', component: SignUp },
  { path: '/dashboard', component: Dashboard },
  { path: '/episodes', name: 'Episodes', component: Episodes },
  { path: '/music', name: 'Music', component: Music },
  { path: '/games', name: 'Games', component: Games },
  { path: '/shop/:index', name: 'shop-item', component: ShopPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  await auth.fetchUser()

  if (to.meta.requiresAuth && !auth.user) {
    next('/login')
  } else {
    next()
  }
})

export default router

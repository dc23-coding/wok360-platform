// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import LandingPage from '@/views/LandingPage.vue'
import Home        from '@/views/Home.vue'
import Episodes    from '@/views/Episodes.vue'
import Music       from '@/views/Music.vue'
import Games       from '@/views/Games.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/episodes',
    name: 'Episodes',
    component: Episodes
  },
  {
    path: '/music',
    name: 'Music',
    component: Music
  },
  {
    path: '/games',
    name: 'Games',
    component: Games
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})

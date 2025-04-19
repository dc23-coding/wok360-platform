import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/LandingPage.vue';
import Home from '@/views/Home.vue'; // Absolute path
import Episodes from '@/views/Episodes.vue';
import Music from '@/views/Music.vue';
import Games from '@/views/Games.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/episodes',
      name: 'episodes',
      component: Episodes,
    },
    {
      path: '/music',
      name: 'music',
      component: Music,
    },
    {
      path: '/games',
      name: 'games',
      component: Games,
    },
    // Add other routes here as needed
  ],
});

export default router;

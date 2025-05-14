import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Remove if unused

// Lazy‑loaded views (Vue SFCs)
const LandingPage  = () => import('@/views/LandingPage.vue');
const HomeView     = () => import('@/views/Home.vue');
const EpisodesView = () => import('@/views/Episodes.vue');
const MusicView    = () => import('@/views/Music.vue');
const GamesView    = () => import('@/views/Games.vue');
const SignInView   = () => import('@/views/SignIn.vue');
const MusicStudio  = () => import('@/views/MusicStudio.vue');

// Mureka Studio Views (JSX in /components/mureka folder)
const MurekaHome   = () => import('@/components/mureka/StudioHome.vue');
const MurekaRecord = () => import('@/components/mureka/RecordInput.vue');
const MurekaText   = () => import('@/components/mureka/TextInput.vue');
const MurekaUpload = () => import('@/components/mureka/UploadInput.vue');
const MurekaFeed   = () => import('@/components/mureka/RemixFeed.vue');

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/landing' },
  { path: '/music-studio', name: 'MusicStudio', component: MusicStudio }, 
  { path: '/landing',   name: 'Landing',   component: LandingPage },
  { path: '/home',      name: 'Home',      component: HomeView },
  { path: '/sign-in',   name: 'SignIn',    component: SignInView, meta: { requiresGuest: true } },
  { path: '/episodes',  name: 'Episodes',  component: EpisodesView, meta: { requiresAuth: true } },
  { path: '/music',     name: 'Music',     component: MusicView,    meta: { requiresAuth: true } },
  { path: '/games',     name: 'Games',     component: GamesView,    meta: { requiresAuth: true } },

  // Mureka Studio Routes
  { path: '/mureka',              name: 'MurekaHome',   component: MurekaHome,   meta: { requiresAuth: true } },
  { path: '/mureka/record',       name: 'MurekaRecord', component: MurekaRecord, meta: { requiresAuth: true } },
  { path: '/mureka/text',         name: 'MurekaText',   component: MurekaText,   meta: { requiresAuth: true } },
  { path: '/mureka/upload',       name: 'MurekaUpload', component: MurekaUpload, meta: { requiresAuth: true } },
  { path: '/mureka/remix-feed',   name: 'MurekaFeed',   component: MurekaFeed,   meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Optional auth/guest guard
// router.beforeEach((to, _from, next) => {
//   const auth = useAuthStore();
//   if (to.meta.requiresAuth && !auth.isAuthenticated) {
//     next('/sign-in');
//   } else if (to.meta.requiresGuest && auth.isAuthenticated) {
//     next('/home');
//   } else {
//     next();
//   }
//  });

//  export default router;
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  const isBypass = sessionStorage.getItem('admin-bypass') === 'true';

  if (isBypass) {
    // ✅ Fully unlock the site if bypass is active
    next();
  } else if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/sign-in');
  } else if (to.meta.requiresGuest && auth.isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

export default router;
// export default router;


import { createApp } from 'vue';
import Particles from '@tsparticles/vue3';
import { loadFull } from 'tsparticles';     // helper to load the entire bundle
import { createPinia } from 'pinia';
import router from '@/router';
import App from './App.vue';
import './index.css';

const app = createApp(App);

/* ------------ Router ------------ */
app.use(router);

/* ------------ tsParticles ------------ */
app.use(Particles, {
  init: async engine => {
    // Load full tsParticles bundle (or pick selective features later)
    await loadFull(engine);
  },
  /* You can pass defaultOptions here later if desired */
});

// ✅ Create Pinia instance and use it
const pinia = createPinia();
app.use(pinia);

/* ------------ Mount ------------ */
app.mount('#app');

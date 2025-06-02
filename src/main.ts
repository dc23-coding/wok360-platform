import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';
import App from './App.vue';
import './index.css';

const app = createApp(App);

/* ------------ Router ------------ */
app.use(router);

/* ------------ tsParticles ------------ */

  /* You can pass defaultOptions here later if desired */


// ✅ Create Pinia instance and use it
const pinia = createPinia();
app.use(pinia);

/* ------------ Mount ------------ */
app.mount('#app');

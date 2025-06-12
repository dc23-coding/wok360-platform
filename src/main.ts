// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
// Make sure the router file exists at the specified path
import router from './/router'; // use relative path if @ alias is not configured
import App from './App.vue';
import './index.css';

const app = createApp(App);

// ✅ Install Pinia before mounting
const pinia = createPinia();
app.use(pinia);

// ✅ Install router
app.use(router);

// ✅ tsParticles init can go here if needed (currently omitted)

// ✅ Mount the app
app.mount('#app');

<template>
  <div class="home-container">
    <!-- Particle background -->
    <Particles
      class="particles"
      :options="particleOptions"
      :init="particlesInit"
    />

    <!-- Login prompt -->
    <div v-if="!isLoggedIn" class="login-prompt">
      Please sign in to access the content.
    </div>

    <!-- Section links -->
    <div v-else class="orbs-container">
      <router-link class="small-orb" to="/episodes">Episodes</router-link>
      <router-link class="small-orb" to="/music">Music</router-link>
      <router-link class="small-orb" to="/games">Games</router-link>
    </div>

    <!-- Portal -->
    <div class="portal-container" @click="enterPortal">
      <div class="background" />
      <div class="portal">
        <span class="portal-text">Enter Portal</span>
      </div>
    </div>

    <footer>
      <p>&copy; 2025 WOK 360. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import Particles from '@tsparticles/vue3';

import { loadSlim } from '@tsparticles/slim'
import type { Engine } from '@tsparticles/engine'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isAuthenticated)

const particlesInit = async (engine: Engine) => {
  await loadSlim(engine)
}

const particleOptions = computed(() => ({
  background: { color: { value: 'transparent' } },
  particles: {
    number: {
      value: window.innerWidth < 768 ? 20 : 40,
      density: { enable: true }
    },
    color: { value: '#bb86fc' },
    links: { enable: true, color: '#bb86fc', opacity: 0.4 },
    move: { enable: true, speed: 2 }
  },
  interactivity: {
    events: { onHover: { enable: true, mode: 'repulse' } },
    modes: { repulse: { distance: 100, duration: 0.4 } }
  }
}))

const enterPortal = () => {
  if (!isLoggedIn.value) {
    router.push('/sign-in')
    return
  }
  const pages = ['/episodes', '/music', '/games']
  const pick = pages[Math.floor(Math.random() * pages.length)]
  router.push(pick)
}

onMounted(() => {
  // any mount logic you need
})
</script>

<!-- External stylesheet to avoid inline/CSP issues -->
<style scoped src="@/assets/styles/home.css"></style>


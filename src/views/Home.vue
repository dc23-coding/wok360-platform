<template>
  <div class="home-container">
    <!-- Section links -->
    <div class="orbs-container">
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
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isAuthenticated)

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
<style src="@/assets/styles/home.css"></style>

<style scoped>

footer {
  position: absolute;
  bottom: 10px;
  text-align: center;
  width: 100%;
  color: #888;
}
</style>


<template>
  <div class="portal-container">
    <div class="background"></div>
    <div class="portal" @click="enterPortal">
      <div class="portal-text">Step into the Universe</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const enterPortal = () => {
  const pages = ['/episodes', '/music', '/games']
  const randomPage = pages[Math.floor(Math.random() * pages.length)]
  router.push(randomPage)
}
</script>

<style scoped src="@/assets/styles/home.css"></style>

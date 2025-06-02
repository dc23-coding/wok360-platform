<template>
  <div>
    <!-- Theme Toggle Button -->
   

    <!-- Ambient Canvas Particle Layer -->
   

    <!-- App Router Content -->
    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'


const currentTheme = ref('dark')

onMounted(() => {
  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.documentElement.style.overflowX = 'hidden'

  const savedTheme = localStorage.getItem('theme') || 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
  currentTheme.value = savedTheme
})

const toggleTheme = () => {
  const nextTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', nextTheme)
  localStorage.setItem('theme', nextTheme)
  currentTheme.value = nextTheme
}
</script>

<style>
html, body, #app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden !important;
}

body > #app > div {
  display: block !important;
  min-height: 100vh;
}

*, *::before, *::after {
  box-sizing: inherit;
}
</style>

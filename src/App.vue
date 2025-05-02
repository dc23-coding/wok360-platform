<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
  // Nuclear option to ensure no margins
  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.documentElement.style.overflowX = 'hidden'
})
</script>

<style>
/* GLOBAL STYLES (not scoped) */
html, body, #app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden !important;
}

/* Remove RouterView potential spacing */
body > #app > div {
  display: block !important;
  min-height: 100vh;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

</style>
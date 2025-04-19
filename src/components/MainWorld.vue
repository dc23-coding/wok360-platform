<template>
    <div class="main-world relative w-full min-h-screen bg-black text-white overflow-hidden">
      <!-- Star Background -->
      <div class="fixed inset-0 z-0">
        <img src="/images/bg.svg" alt="stars" class="w-full h-full object-cover opacity-40" />
      </div>
  
      <!-- Scrollable World Content -->
      <div class="relative z-10 px-4 pt-40 pb-64 space-y-40 max-w-6xl mx-auto">
        <!-- Welcome Section -->
        <section class="text-center">
          <h1 class="text-5xl font-bold mb-4">Welcome, Voyager</h1>
          <p class="text-xl max-w-xl mx-auto">Scroll down and unlock your digital dimension.</p>
        </section>
  
        <!-- Floating Tablet Reveal -->
        <section
          ref="tabletSection"
          class="transition-opacity duration-1000 ease-in-out text-center"
          :class="{ 'opacity-100 translate-y-0': tabletVisible, 'opacity-0 translate-y-12': !tabletVisible }"
        >
          <img src="/images/tablet-frame.png" alt="tablet" class="w-[600px] mx-auto drop-shadow-xl" />
          <p class="mt-4 text-lg">Access the Karma Tablet: your portal to episodes, experiences, and NFTs.</p>
        </section>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const tabletVisible = ref(false)
  const tabletSection = ref<HTMLElement | null>(null)
  
  const onScroll = () => {
    if (tabletSection.value) {
      const rect = tabletSection.value.getBoundingClientRect()
      tabletVisible.value = rect.top < window.innerHeight * 0.8
    }
  }
  
  onMounted(() => {
    window.addEventListener('scroll', onScroll)
    onScroll() // Trigger on first mount
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
  </script>
  
  <style scoped>
  .main-world {
    background: linear-gradient(to bottom, #000, #0a0a0a 60%, #0f0f0f);
    scroll-behavior: smooth;
  }
  </style>
  
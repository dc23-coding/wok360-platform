<template>
    <div class="sliding-text">
      <p
        v-for="(item, index) in texts"
        :key="index"
        class="text-item"
        :class="{ active: currentIndex === index, [item.animation]: true }"
      >
        {{ item.text }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  
  // Define props explicitly
  interface Props {
    texts: { text: string; animation: string }[]
    duration: number
  }
  
  const { texts, duration } = defineProps<Props>()
  
  const currentIndex = ref(0)
  let intervalId: number | null = null
  
  onMounted(() => {
    // Debug props
    console.log('SlidingText props:', { texts, duration })
    
    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % texts.length
    }, duration)
  })
  
  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
  </script>
  
  <style scoped>
  .sliding-text {
    width: 100%;
    max-width: 600px;
    text-align: center;
    margin: 0 auto;
    padding: 0;
    position: relative;
    height: 2rem;
    overflow: hidden;
    color: #bb86fc;
    font-size: 1rem;
  }
  
  .text-item {
    position: absolute;
    width: 100%;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.8s ease-in-out;
  }
  
  .text-item.active {
    opacity: 1;
    transform: translateX(0);
  }
  
  .text-item:not(.active) {
    transform: translateX(-100%);
  }
  
  .slideIn {
    transform: translateX(-100%);
  }
  
  .slideIn.active {
    transform: translateX(0);
  }
  
  .slideInRight {
    transform: translateX(100%);
  }
  
  .slideInRight.active {
    transform: translateX(0);
  }
  
  @media (max-width: 768px) {
    .sliding-text {
      font-size: 0.9rem;
      height: 1.8rem;
    }
  }
  
  @media (max-width: 480px) {
    .sliding-text {
      font-size: 0.8rem;
      height: 1.6rem;
    }
  }
  </style>
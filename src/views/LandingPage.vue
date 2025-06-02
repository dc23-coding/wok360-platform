<!-- src/views/LandingPage.vue -->
<template>
  <section class="video-hero">
    <!-- Video background (static asset) -->
    <video
      v-if="showVideo"
      ref="heroVideo"
      class="full-page-video"
      src="@/assets/video/Harvest-Intro.mp4"
      poster="@/assets/images/2.png"
      autoplay
      loop
      muted
      playsinline
      @error="showVideo = false"
    >
      <img src="@/assets/images/2.png" alt="Video Placeholder" />
    </video>
    <!-- Fallback image if video fails -->
    <img
      v-else
      src="@/assets/images/2.png"
      alt="Video Placeholder"
      class="full-page-video"
    />

    <!-- Semi‐transparent overlay -->
    <div class="overlay"></div>

    <!-- Hero text and Enter button -->
    <div class="hero-content">
      <h1>Welcome to the WOK 360</h1>
      <p>Immerse yourself in the future of media.</p>
      <button class="enter-button" @click="goHome">Enter</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showVideo = ref(true)

function goHome() {
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.video-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.full-page-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 1rem;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.enter-button {
  background-color: #1e40af;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.enter-button:hover {
  background-color: #1e3a8a;
}
</style>

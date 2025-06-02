<template>
  <section class="video-hero">
    <video id="landing-video" autoplay muted playsinline>
      <source src="@/assets/video/Harvest-intro.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="overlay"></div>

    <div class="hero-content">
      <h1>Welcome to Metaverse Media</h1>
      <p>Immerse yourself in the future of media.</p>
      <button class="btn" @click="showModal = true">Enter</button>
    </div>

    <NavigationModal v-if="showModal" @close="showModal = false" />
  </section>
</template>

<script>
import NavigationModal from '@/components/NavigationModal.vue'

export default {
  components: { NavigationModal },
  data() {
    return {
      showModal: false
    }
  }
}
</script>

<style scoped src="@/styles/landing.css"></style>

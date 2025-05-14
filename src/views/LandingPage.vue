<template>
  <section class="video-hero">
    <img
      :src="placeholderImageUrl"
      alt="Video Placeholder"
      class="full-page-background"
    />
    <div class="overlay"></div>
    <div class="hero-content">
      <h1>Welcome to the WOK 360</h1>
      <p>Immerse yourself in the future of media.</p>
      <button class="enter-button" @click="openModal">Enter</button>
    </div>
    <NavigationModal :visible="showModal" @close="closeModal" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavigationModal from '@/components/NavigationModal.vue';
import placeholderImageUrl from '@/assets/images/7.png';

const router = useRouter();
const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const navigateTo = (route) => {
  showModal.value = false;
  router.push(route);
};
</script>

<style scoped src="@/styles/landing.css" />
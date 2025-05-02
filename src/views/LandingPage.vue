<template>
  <!-- Remove any potential white space between tags -->
  <section class="video-hero"><img
    :src="placeholderImageUrl"
    alt="Video Placeholder"
    class="full-page-background"
  /><div
    class="overlay"
  ></div><div
    class="hero-content"
  ><h1>Welcome to the WOK 360</h1><p>Immerse yourself in the future of media.</p><button
    class="enter-button"
    @click="openModal"
  >Enter</button></div><NavigationModal
    :visible="showModal"
    @close="closeModal"
  /></section>
</template>

<script>
import { useRouter } from 'vue-router';
import { defineComponent } from 'vue';
import NavigationModal from '@/components/NavigationModal.vue';
import placeholderImageUrl from '@/assets/images/7.png';

export default defineComponent({
  name: 'LandingPage',
  components: {
    NavigationModal,
  },
  data() {
    return {
      showModal: false,
      placeholderImageUrl,
    };
  },
  setup() {
    const router = useRouter();

    const navigateTo = (route) => {
      router.push(route);
    };

    return { navigateTo };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
});
</script>

<style scoped src="@/styles/landing.css" />

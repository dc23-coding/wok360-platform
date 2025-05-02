<template>
    <div
      class="orb"
      @mouseenter="showPreview"
      @mouseleave="hidePreview"
      @click="isLoggedIn ? goToPage(name) : promptLogin()"
    >
      <img :src="orbImage" class="orb-img" />
  
      <transition name="fade">
        <div v-if="previewVisible" class="preview-box">
          <p>{{ previewText }}</p>
        </div>
      </transition>
    </div>
  </template>

  
  
  <script>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  export default {
    props: ['name', 'orbImage'],
    data() {
      return {
        previewVisible: false,
        audio: null,
        router: useRouter(),
        authStore: useAuthStore()
      }
    },
    computed: {
      previewText() {
        return {
          music: "Stream exclusive tracks & earn crypto.",
          mall: "Get paid for what you already buy.",
          nfts: "Collect & trade your vibe.",
        }[this.name] || "Explore Karma."
      },
      isLoggedIn() {
        return this.authStore.isAuthenticated
      }
    },
    methods: {
      showPreview() {
        this.previewVisible = true
        this.audio = new Audio(`/sounds/${this.name}-hover.mp3`)
        this.audio.volume = 0.3
        this.audio.loop = true
        this.audio.play()
      },
      hidePreview() {
        this.previewVisible = false
        if (this.audio) {
          this.audio.pause()
          this.audio.currentTime = 0
          this.audio = null
        }
      },
      goToPage(name) {
        this.router.push({ name })
      },
      promptLogin() {
        this.$emit('show-login-modal')
      }
    }
  }
  </script>
  
  <style scoped>
  .orb {
    position: relative;
    width: 160px;
    height: 160px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .orb:hover {
    transform: scale(1.05);
  }
  
  .orb-img {
    width: 100%;
    border-radius: 9999px;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.2);
  }
  
  .preview-box {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 12px;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 14px;
    border-radius: 12px;
    color: #fff;
    white-space: nowrap;
    font-size: 0.875rem;
  }
  </style>
  
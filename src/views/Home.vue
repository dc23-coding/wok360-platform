<template>
  <div class="home-container">
    <!-- Background Particles -->
    <div class="particles"></div>

    <!-- Top Tabs -->
    <div class="menu-bar">
      <span class="menu-tab" @click="goTo('/episodes')">Episodes</span>
      <span class="menu-tab" @click="goTo('/music')">Music</span>
      <span class="menu-tab" @click="goTo('/games')">Games</span>
    </div>

    <!-- 3-Orb Layout -->
    <div class="orb-row">
      <!-- Left Orb: Avatar -->
      <div class="orb avatar-orb" @click="triggerAvatar">
        <video
          ref="avatarVideo"
          class="avatar-video"
          src="/avatars/avatar-priestsw.mp4"
          autoplay
          loop
          muted
          playsinline
        ></video>
      </div>

      <!-- Center Orb: Portal -->
      <div class="orb portal-orb pulse" @click="enterPortal">
        <span class="portal-text">Enter Portal</span>
      </div>

      <!-- Right Orb: Talk -->
      <div class="orb action-orb press" @click="triggerFunction">
        <span class="action-text">Talk</span>
      </div>
    </div>

    <!-- Footer -->
    <footer>
      <p>&copy; 2025 WOK 360. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const avatarVideo = ref<HTMLVideoElement | null>(null)

const enterPortal = () => {
  const pages = ['/episodes', '/music', '/games']
  const randomPage = pages[Math.floor(Math.random() * pages.length)]
  router.push(randomPage)
}

const triggerAvatar = () => {
  if (avatarVideo.value) {
    avatarVideo.value.currentTime = 0
    avatarVideo.value.play()
  }
}

const triggerFunction = () => {
  console.log('Function button clicked!')
}

const goTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #0d0d0d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  position: relative;
  overflow: hidden;
}

/* Particle Background */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: -1;
}

/* Top Tabs */
.menu-bar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
  margin-bottom: 30px;
}

.menu-tab {
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease;
}

.menu-tab:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Orb Row Layout */
.orb-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 60px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  z-index: 1;
}

/* Orb Design */
.orb {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, #1f1f1f 60%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.orb:hover {
  transform: scale(1.05);
}

/* Avatar Orb */
.avatar-video {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Portal Orb Pulse */
.pulse {
  animation: pulseGlow 2s infinite;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  }
  50% {
    box-shadow: 0 0 40px #00ffff, 0 0 60px #00ffff;
  }
  100% {
    box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  }
}

/* Talk Orb Press */
.press:active {
  transform: scale(0.95);
  box-shadow: 0 0 15px #ff00ff, 0 0 40px #ff00ff;
}

/* Orb Text Labels */
.portal-text,
.action-text {
  font-size: 1.5rem;
  color: #fff;
  font-weight: bold;
}

/* Footer */
footer {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
  color: #888;
  font-size: 0.875rem;
}
</style>

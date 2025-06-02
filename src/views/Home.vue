<template>
  <div class="home-container">
    <!-- Background Particles -->
    <div class="particles"></div>

    <!-- Top Tabs -->
    <div class="menu-bar">
      <router-link to="/episodes" class="menu-tab">Episodes</router-link>
      <router-link to="/music" class="menu-tab">Music</router-link>
      <router-link to="/games" class="menu-tab">Games</router-link>
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

      <!-- Right Orb: Shopify Products -->
      <div class="orb shopify-orb" @click="cycleProduct">
        <img
          :src="products[currentIndex].img"
          :alt="products[currentIndex].name"
          class="product-image"
        />
        <div class="product-label">
          {{ products[currentIndex].name }}<br>{{ products[currentIndex].price }}
        </div>
      </div>
    </div>

    <!-- Buy Now Button -->
    <div v-if="products[currentIndex].url" class="buy-button-container">
      <a
        :href="products[currentIndex].url"
        target="_blank"
        rel="noopener noreferrer"
        class="buy-button"
      >
        Buy Now
      </a>
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

interface Product {
  name: string
  img: string
  price: string
  url: string
}

const router = useRouter()
const avatarVideo = ref<HTMLVideoElement | null>(null)

const products: Product[] = [
  {
    name: 'WC-Jacket',
    img: '/products/branded-jacket-1.png',
    price: '$70.00',
    url: 'https://kg4bp4-ae.myshopify.com/products/unisex-bomber-jacket'
  },
  {
    name: 'WC-Sneakers',
    img: '/products/branded-canvas-1.png',
    price: '$65.00',
    url: 'https://kg4bp4-ae.myshopify.com/products/men-s-lace-up-canvas-shoes'
  },
  {
    name: 'WC-TShirts',
    img: '/products/branded-tshirt-1.png',
    price: '$30.00',
    url: 'https://kg4bp4-ae.myshopify.com/products/women-s-basic-softstyle-t-shirt'
  },
  {
    name: 'WC-Sweater',
    img: '/products/branded-sweater-fly.png',
    price: '$30.50',
    url: 'https://kg4bp4-ae.myshopify.com/products/unisex-premium-sweatshirt?variant=51386017349946'
  },
  {
    name: 'WC-Skirt',
    img: '/products/branded-dress-3.png',
    price: '$48.99',
    url: 'https://kg4bp4-ae.myshopify.com/products/skater-dress'
  },
  {
    name: 'WC-Swimwear',
    img: '/products/branded-swimwear-7.png',
    price: '$39.49',
    url: 'https://kg4bp4-ae.myshopify.com/products/one-piece-swimsuit'
  }
]

const currentIndex = ref(0)

const cycleProduct = () => {
  currentIndex.value = (currentIndex.value + 1) % products.length
}

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
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #0d0d0d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
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
  gap: 6vw;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  z-index: 1;
  flex-wrap: wrap;
}

/* Orb Design */
.orb {
  width: 30vw;
  max-width: 300px;
  min-width: 150px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: radial-gradient(circle, #1f1f1f 60%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.orb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px #00ffff, 0 0 60px #00ffff;
}

/* Avatar Orb */
.avatar-video {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.avatar-orb {
  background: radial-gradient(circle, #1f1f1f 60%, #000000 100%);
}
.avatar-orb:hover {
  box-shadow: 0 0 30px #00ffff, 0 0 60px #00ffff;
}
.portal-orb {
  /* Example background gradient; adjust colors as desired */
  background: radial-gradient(circle, #1f1f1f 60%, #006666 100%);
}

.portal-orb .portal-text {
  /* Bright text color */
  color: #ffffff;
  font-weight: bold;
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

/* Shopify Orb */
.shopify-orb .product-image {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  object-fit: cover;
}

.shopify-orb .product-label {
  position: absolute;
  bottom: 16px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 1rem;
  color: #fff;
  text-align: center;
  line-height: 1.2;
}

/* Buy Now Button */
.buy-button-container {
  margin-top: 20px;
  z-index: 1;
}

.buy-button {
  background-color: #00ffff;
  color: #0d0d0d;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.buy-button:hover {
  background-color: #00d4d4;
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

/* Responsive Text Size */
@media (max-width: 768px) {
  .menu-tab {
    font-size: 0.9rem;
    padding: 8px 16px;
  }

  .shopify-orb .product-label,
  .portal-orb .portal-text {
    font-size: 0.85rem;
  }

  .buy-button {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .home-container {
    padding: 20px 10px;
  }

  .menu-tab {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .shopify-orb .product-label,
  .portal-orb .portal-text {
    font-size: 0.75rem;
  }

  .buy-button {
    font-size: 0.8rem;
    padding: 8px 16px;
  }
}
</style>

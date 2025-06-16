<template>
  <div class="home-container">
    <!-- Background Particles -->
    <div class="particles"></div>

    <!-- Top Tabs (Guest Lock Enabled) -->
<div class="menu-bar">
  <router-link
    :to="user ? '/dashboard' : '/'"
    class="menu-tab"
  >
    {{ user ? 'Dashboard' : 'Home' }}
  </router-link>

  <template v-if="user">
    <router-link to="/episodes" class="menu-tab">Episodes</router-link>
    <router-link to="/music" class="menu-tab">Music</router-link>
    <router-link to="/games" class="menu-tab">Games</router-link>
  </template>

  <template v-else>
    <span class="menu-tab disabled">Episodes</span>
    <span class="menu-tab disabled">Music</span>
    <span class="menu-tab disabled">Games</span>
  </template>
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
      <div class="orb portal-orb pulse" @click="enterPortal" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
        <span class="portal-text">{{ user ? 'Explore Portal' : 'Sign In to Explore' }}</span>
        <transition name="fade">
          <div v-if="showTooltip" class="portal-tooltip">
            {{ user ? 'Discover random content' : 'Sign in for full access' }}
          </div>
        </transition>
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

    <div class="bg-indigo-50 border border-indigo-200 text-indigo-800 text-center rounded-lg py-3 px-5 mt-10 mx-auto max-w-xl shadow-sm">
  🎵 <strong>This is a free service.</strong> Rewards, artist credits, and exclusive merch drops are coming soon!
     </div>


    <!-- Footer -->
    <footer>
      <p>&copy; 2025 WOK 360. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const router = useRouter()
const avatarVideo = ref<HTMLVideoElement | null>(null)
const showTooltip = ref(false)
const user = ref<any>(null)
const loading = ref(false)

interface Product {
  name: string
  img: string
  price: string
  url: string
}

const products: Product[] = [
  {
    name: 'WC-Jacket',
    img: '/products/branded-bomber-patched.png',
    price: '$70.00',
    url: 'https://worldofkarma360.myshopify.com/products/unisex-bomber-jacket'
  },
  {
    name: 'WC-Sneakers',
    img: '/products/branded-canvas-1.png',
    price: '$65.00',
    url: 'https://worldofkarma360.myshopify.com/products/men-s-lace-up-canvas-shoes'
  },
  {
    name: 'WC-TShirts',
    img: '/products/branded-tshirt-1.png',
    price: '$30.00',
    url: 'https://worldofkarma360.myshopify.com/products/women-s-basic-softstyle-t-shirt-2'
  },
  {
    name: 'WC-Sweater',
    img: '/products/branded-sweater-fly.png',
    price: '$30.50',
    url: 'https://worldofkarma360.myshopify.com/products/unisex-premium-sweatshirt'
  },
  {
    name: 'WC-Skirt',
    img: '/products/branded-dress-3.png',
    price: '$48.99',
    url: 'https://worldofkarma360.myshopify.com/products/skater-dress-2'
  },
  {
    name: 'WC-Swimwear',
    img: '/products/branded-swimwear-7.png',
    price: '$39.49',
    url: 'https://worldofkarma360.myshopify.com/products/one-piece-swimsuit'
  },
  {
    name: 'WC-SportsBra',
    img: '/products/branded-sportsbra-23.png',
    price: '$37.50',
    url: 'https://worldofkarma360.myshopify.com/products/padded-sports-bra'
  },
  {
    name: 'WC-Hoodie',
    img: '/products/branded-hoodie-savage-1.png',
    price: '$48.00',
    url: 'https://worldofkarma360.myshopify.com/products/premium-eco-hoodie'
  },
  {
    name: 'WC-Slides',
    img: '/products/branded-mens-slides.png',
    price: '$34.50',
    url: 'https://worldofkarma360.myshopify.com/products/men-s-slides'
  }
]

const currentIndex = ref(0)

onMounted(async () => {
  try {
    loading.value = true
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user
  } catch (error) {
    console.error('Error checking auth state:', error)
  } finally {
    loading.value = false
  }

  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user
  })
})

const cycleProduct = () => {
  currentIndex.value = (currentIndex.value + 1) % products.length
}

const enterPortal = () => {
  if (user.value) {
    const pages = ['/episodes', '/music', '/games']
    const randomPage = pages[Math.floor(Math.random() * pages.length)]
    router.push(randomPage)
  } else {
    router.push('/login')
  }
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

/* Auth Status */
.auth-status {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-status.logged-in {
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
}

.sign-out-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sign-out-btn:hover {
  background: rgba(255, 255, 255, 0.1);
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
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-decoration: none;
}

.menu-tab:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
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
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  transition: transform 0.3s ease;
}

.avatar-orb:hover .avatar-video {
  transform: scale(1.05);
}

/* Portal Orb */
.portal-orb {
  background: radial-gradient(circle, #1f1f1f 60%, #006666 100%);
}

.portal-text {
  color: #ffffff;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  text-align: center;
  padding: 0 10px;
}

.portal-orb:hover .portal-text {
  transform: scale(1.1);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.portal-tooltip {
  position: absolute;
  bottom: -40px;
  width: 200px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  font-size: 0.8rem;
  text-align: center;
  pointer-events: none;
  backdrop-filter: blur(5px);
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
  transition: transform 0.3s ease;
}

.shopify-orb:hover .product-image {
  transform: scale(1.05);
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
  transition: all 0.3s ease;
}

.shopify-orb:hover .product-label {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-5px);
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
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.buy-button:hover {
  background-color: #00d4d4;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

/* Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

  .auth-status {
    font-size: 0.8rem;
    padding: 6px 12px;
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

  .auth-status {
    top: 10px;
    right: 10px;
    font-size: 0.7rem;
  }

  .auth-status span {
  white-space: nowrap;
}

.auth-status button {
  margin-left: 8px;
}

.menu-tab.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}



  .orb-row {
    gap: 4vw;
  }
}
</style>
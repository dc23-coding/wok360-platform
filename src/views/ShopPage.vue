<template>
  <div class="shop-page-container">
    <h1 class="shop-page-title">Shop</h1>
    <div class="product-details" v-if="product">
      <img :src="product.img" :alt="product.name" class="shop-product-image" />
      <h2 class="shop-product-name">{{ product.name }}</h2>
      <p class="shop-product-price">{{ product.price }}</p>
      <button class="shop-product-buy" @click="goToShopify">
        Go to Shopify
      </button>
    </div>
    <div v-else class="shop-loading">
      Loading…
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Product {
  name: string
  img: string
  price: string
  url: string
}

const route = useRoute()
const product = ref<Product | null>(null)

onMounted(() => {
  // Grab the “index” param or “name” param (whichever you choose) from the route,
  // then look up your product in the same list you defined in Home.vue.
  const allProducts: Product[] = [
    {
      name: 'WC-Jacket',
      img: '/products/branded-jacket-1.png',
      price: '$70.00',
      url: 'https://your-shopify-store.com/products/wc-jacket'
    },
    {
      name: 'WC-Sneakers',
      img: '/products/branded-canvas-1.png',
      price: '$50.00',
      url: 'https://your-shopify-store.com/products/wc-sneakers'
    },
    {
      name: 'WC-TShirts',
      img: '/products/branded-tshirt-1.png',
      price: '$30.00',
      url: 'https://your-shopify-store.com/products/wc-tshirt'
    }
  ]

  // We passed “currentIndex” as a route param. Convert to number, find product:
  const idx = parseInt(route.params.index as string, 10)
  if (!isNaN(idx) && idx >= 0 && idx < allProducts.length) {
    product.value = allProducts[idx]
  }
})

function goToShopify() {
  if (product.value) {
    window.open(product.value.url, '_blank')
  }
}
</script>

<style scoped>
.shop-page-container {
  min-height: 100vh;
  background-color: #0d0d0d;
  color: #fff;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.shop-page-title {
  font-size: 2rem;
  margin-bottom: 24px;
}

.product-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.shop-product-image {
  width: 300px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 16px;
}

.shop-product-name {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.shop-product-price {
  font-size: 1.25rem;
  margin-bottom: 16px;
}

.shop-product-buy {
  background-color: #00ffff;
  color: #0d0d0d;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.shop-product-buy:hover {
  background-color: #00d4d4;
}

.shop-loading {
  font-size: 1.25rem;
}
</style>

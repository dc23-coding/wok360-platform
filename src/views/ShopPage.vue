<template>
  <div class="shop-page-container">
    <h1 class="shop-page-title">Shop All Products</h1>
    <div class="product-grid">
      <div v-for="(product, index) in products" :key="index" class="product-card">
        <img :src="product.img" :alt="product.name" class="product-image" />
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="product-price">{{ product.price }}</p>
        <a
          :href="product.url"
          target="_blank"
          rel="noopener noreferrer"
          class="product-buy"
        >
          Buy Now
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  margin-bottom: 32px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;
}

.product-card {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 255, 255, 0.2);
}

.product-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
  object-fit: cover;
}

.product-name {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.product-price {
  font-size: 1rem;
  margin-bottom: 12px;
}

.product-buy {
  background-color: #00ffff;
  color: #0d0d0d;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.product-buy:hover {
  background-color: #00d4d4;
}
</style>

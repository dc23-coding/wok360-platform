<template>
  <div class="karma-mall-page">
    <section class="intro">
      <h1>Welcome to Karma Mall</h1>
      <p class="tagline">Earn crypto. Stream music. Shop with purpose. Karma rewards every click.</p>
    </section>

    <section class="music-section">
      <h2>🎶 Featured Music Player</h2>
      <MusicPlayer />
    </section>

    <section class="affiliate-section">
      <h2>🛍️ Featured Products & Services</h2>
      <div class="cards">
        <div class="card">
          <h3>Fuel Rewards</h3>
          <p>Earn cashback or crypto by buying fuel with our partner links.</p>
        </div>
        <div class="card">
          <h3>Truck Gear & Apparel</h3>
          <p>Shop top-rated gear. Support trucker-owned brands.</p>
        </div>
        <div class="card">
          <h3>Karma Crypto Wallet</h3>
          <p>Coming soon: Track your rewards & withdraw directly to your wallet.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import MusicPlayer from '@/components/MusicPlayer.vue'

export default {
  name: 'KarmaMall', // we rename it in code even if the file is still MusicPage.vue
  components: {
    MusicPlayer
  }
}
</script>

<style scoped>
.karma-mall-page {
  padding: 2rem;
  color: #fff;
  background: #121212;
  min-height: 100vh;
}

.intro {
  text-align: center;
  margin-bottom: 3rem;
}

.tagline {
  font-style: italic;
  color: #03dac5;
  margin-top: 0.5rem;
}

.music-section {
  text-align: center;
  margin-bottom: 3rem;
}

.affiliate-section {
  margin-top: 2rem;
  text-align: center;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.card {
  background: #1e1e1e;
  padding: 1.5rem;
  border-radius: 1rem;
  max-width: 300px;
  flex: 1 1 250px;
  text-align: left;
  transition: transform 0.3s ease;
  border: 1px solid #2b2b2b;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 0 12px #03dac5aa;
}
</style>

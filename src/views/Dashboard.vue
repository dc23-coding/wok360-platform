<template>
  <div class="dashboard-wrapper">
    <h1 class="dashboard-title">Welcome, {{ user?.email }}</h1>
   <div class="dashboard-tabs">
    <router-link to="/" class="tab-link">Home</router-link>
    <router-link to="/episodes" class="tab-link">Episodes</router-link>
    <router-link to="/music" class="tab-link">Music</router-link>
    <router-link to="/games" class="tab-link">Games</router-link>
    </div>

    <div class="dashboard-grid">
      <DashboardCard title="Game Points" :value="gamePoints" icon="🎮" />
      <DashboardCard title="Rewards Earned" :value="rewards.length" icon="🏆" />
      <DashboardCard title="Favorite Clothing" :value="favoriteClothing.length" icon="🛍️" />
      <DashboardCard title="Episodes Watched" :value="episodesWatched" icon="🎬" />
      <DashboardCard title="Music Played" :value="musicPlayed" icon="🎧" />
    </div>
  </div>
    <div class="wallet-box">
  <button @click="connectWallet" v-if="!isWalletConnected">
    Connect MetaMask
  </button>
  <div v-else>
    Wallet: {{ walletAddress }}
  </div>
</div>
    <div class="wallet-section">
  <button @click="connectWallet" v-if="!isWalletConnected">
    Connect MetaMask
  </button>
  <div v-else>
    Wallet: {{ walletAddress }}
  </div>
</div>

<footer class="dashboard-footer" v-if="isWalletConnected">
  <p class="disclaimer">
    This platform is non-custodial. You initiate all payments via MetaMask.<br />
    We store minimal transaction data (email, wallet, amount) only to track your rewards.
  </p>
</footer>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { supabase } from '@/lib/supabase'
import DashboardCard from '@/components/DashboardCard.vue'
import { ethers } from 'ethers'

const auth = useAuthStore()
const user = ref(auth.user)
const walletAddress = ref('')
const isWalletConnected = ref(false)

const connectWallet = async () => {
  if (!window.ethereum) {
    alert('MetaMask not found.')
    return
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    walletAddress.value = accounts[0]
    isWalletConnected.value = true

    // OPTIONAL: Save to Supabase
    await supabase
      .from('users_meta')
      .update({ wallet_address: walletAddress.value })
      .eq('user_id', user.value.id)

  } catch (err) {
    console.error('Wallet connect error:', err)
  }
}

const gamePoints = ref(0)
const rewards = ref([])
const favoriteClothing = ref([])
const episodesWatched = ref(0)
const musicPlayed = ref(0)

onMounted(async () => {
  if (!user.value) return

  const userId = user.value.id

  // Fetch users_meta
  const { data: meta, error: metaErr } = await supabase
    .from('users_meta')
    .select('game_points, rewards')
    .eq('user_id', userId)
    .single()

  if (!metaErr && meta) {
    gamePoints.value = meta.game_points || 0
    rewards.value = meta.rewards || []
  }

  // Fetch favorites
  const { data: favs } = await supabase
    .from('favorites')
    .select('item_name')
    .eq('user_id', userId)

  favoriteClothing.value = favs?.map(f => f.item_name) || []

  // Count episodes_seen
  const { count: epCount } = await supabase
    .from('episodes_seen')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  episodesWatched.value = epCount || 0

  // Count music_history
  const { count: musCount } = await supabase
    .from('music_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  musicPlayed.value = musCount || 0
})
</script>


<style scoped>
.dashboard-wrapper {
  padding: 40px 20px;
  background: #0d0d0d;
  color: #fff;
  min-height: 100vh;
}

.dashboard-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #bb86fc;
  text-align: center;
}

.dashboard-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
.wallet-section {
  margin-top: 2rem;
  text-align: center;
}

.wallet-section button {
  background: #bb86fc;
  color: #121212;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.dashboard-footer {
  margin-top: 3rem;
  padding: 1rem;
  border-top: 1px solid #333;
  font-size: 0.85rem;
  color: #aaa;
  text-align: center;
}

.disclaimer {
  line-height: 1.5;
}
.dashboard-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
.dashboard-card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 12px rgba(187, 134, 252, 0.3);
  text-align: center;
  color: #fff;
  transition: transform 0.3s;
}
.dashboard-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px #bb86fc;
}
.dashboard-card .icon {
  font-size: 2rem;
  margin-bottom: 10px;
}
.dashboard-card h3 {
  margin: 10px 0;
  font-size: 1.2rem;
  color: #bb86fc;
}
.dashboard-card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}
.wallet-box {
  margin-top: 2rem;
  text-align: center;
}
.wallet-box button {
  background: #bb86fc;
  color: #121212;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.wallet-box button:hover {
  background: #9b6efb;
}
.wallet-box div {
  margin-top: 10px;
  font-size: 1rem;
  color: #0ff;
}
.dashboard-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;
}

.tab-link {
  padding: 10px 20px;
  background: #1a1a1a;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.2s ease;
}

.tab-link:hover {
  background: #333;
}

</style>


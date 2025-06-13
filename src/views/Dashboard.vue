<!-- src/views/Dashboard.vue -->
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
      <DashboardCard title="View Rewards History" :value="'↗'" icon="📜" @click="showRewardsModal = true" />
    </div>

    <div class="wallet-box">
      <button @click="connectWallet" v-if="!isWalletConnected">Connect MetaMask</button>
      <div v-else>Wallet: {{ walletAddress }}</div>
    </div>

    <!-- Add below your existing wallet-section -->
<section class="rewards-section">
  <h2 class="rewards-title">Claim Your Reward</h2>
  <p class="rewards-subtitle">Your current points: {{ gamePoints }}</p>

  <div class="rewards-tiers">
    <button
      v-for="tier in rewardTiers"
      :key="tier.id"
      :disabled="gamePoints < tier.pointsRequired"
      @click="claimTierReward(tier)"
      class="reward-btn"
    >
      {{ tier.label }} – {{ tier.pointsRequired }} pts
    </button>
  </div>
</section>


    <footer class="dashboard-footer" v-if="isWalletConnected">
      <p class="disclaimer">
        This platform is non-custodial. You initiate all payments via MetaMask.<br />
        We store minimal transaction data (email, wallet, amount) only to track your rewards.
      </p>
    </footer>

    <!-- Rewards Modal -->
     <RewardsModal :visible="showRewards" @close="showRewards = false" />
     <button class="tab-link" @click="showRewards = true">View Rewards</button>

    <div v-if="showRewardsModal" class="modal-overlay">
      <div class="modal">
        <h2 class="modal-title">Rewards History</h2>
        <button class="close-btn" @click="showRewardsModal = false">×</button>
        <div v-if="rewards.length === 0" class="empty-rewards">No rewards earned yet.</div>
        <ul v-else class="rewards-list">
          <li v-for="(reward, index) in rewards" :key="index">
            <span class="reward-points">+{{ reward.points }} pts</span>
            <span class="reward-type">{{ reward.type }}</span>
            <span class="reward-date">{{ formatDate(reward.timestamp) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { supabase } from '@/lib/supabase'
import DashboardCard from '@/components/DashboardCard.vue'
import { ethers } from 'ethers'
import RewardsModal from '@/components/RewardsModal.vue'
import { claimReward } from '@/composables/useRewardClaim';

const showRewards = ref(false);
const auth = useAuthStore()
const user = ref(auth.user)
const walletAddress = ref('')
const isWalletConnected = ref(false)

const connectWallet = async () => {
  if (!window.ethereum) return alert('MetaMask not found.')

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    walletAddress.value = accounts[0]
    isWalletConnected.value = true
    await supabase.from('users_meta').update({ wallet_address: walletAddress.value }).eq('user_id', user.value.id)
  } catch (err) {
    console.error('Wallet connect error:', err)
  }
}

const gamePoints = ref(0)
const rewards = ref([])
const favoriteClothing = ref([])
const episodesWatched = ref(0)
const musicPlayed = ref(0)
const showRewardsModal = ref(false)

const formatDate = (ts) => {
  return new Date(ts).toLocaleDateString() + ' ' + new Date(ts).toLocaleTimeString()
}

onMounted(async () => {
  if (!user.value) return
  const userId = user.value.id

  const { data: meta } = await supabase
    .from('users_meta')
    .select('game_points, rewards')
    .eq('user_id', userId)
    .single()

  if (meta) {
    gamePoints.value = meta.game_points || 0
    rewards.value = meta.rewards || []
  }

  const { data: favs } = await supabase
    .from('favorites')
    .select('item_name')
    .eq('user_id', userId)

  favoriteClothing.value = favs?.map(f => f.item_name) || []

  const { count: epCount } = await supabase
    .from('episodes_seen')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  episodesWatched.value = epCount || 0

  const { count: musCount } = await supabase
    .from('music_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  musicPlayed.value = musCount || 0

  const rewardTiers = [
  { id: 1, label: 'Stickers', pointsRequired: 1000 },
  { id: 2, label: 'Shirt', pointsRequired: 25000 },
  { id: 3, label: 'Full Outfit', pointsRequired: 50000 },
]

const claimTierReward = async (tier) => {
  if (gamePoints.value < tier.pointsRequired) return

  const { success, error } = await claimReward(tier.id)
  if (success) {
    alert(`✅ You claimed: ${tier.label}`)
  } else {
    alert(`❌ Failed to claim reward: ${error}`)
  }
}
})
</script>

<style scoped>
/* Base Layout */
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

.dashboard-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.dashboard-footer {
  margin-top: 3rem;
  padding: 1rem;
  border-top: 1px solid #333;
  font-size: 0.85rem;
  color: #aaa;
  text-align: center;
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

.wallet-box div {
  margin-top: 10px;
  font-size: 1rem;
  color: #0ff;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: #1a1a1a;
  color: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 0 20px #bb86fc88;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 16px;
  text-align: center;
  color: #bb86fc;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 1.5rem;
  background: none;
  color: #bbb;
  border: none;
  cursor: pointer;
}

.rewards-list {
  list-style: none;
  padding: 0;
}

.rewards-list li {
  background: #262626;
  border: 1px solid #444;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

.reward-points {
  color: #22c55e;
  font-weight: bold;
}

.reward-type {
  color: #c084fc;
}

.reward-date {
  color: #aaa;
  font-size: 0.85rem;
}

.empty-rewards {
  text-align: center;
  color: #888;
  font-style: italic;
  margin-top: 12px;
}

.rewards-section {
  margin-top: 3rem;
  text-align: center;
}

.rewards-title {
  font-size: 1.5rem;
  color: #bb86fc;
  margin-bottom: 0.5rem;
}

.rewards-subtitle {
  font-size: 1rem;
  color: #aaa;
  margin-bottom: 1rem;
}

.rewards-tiers {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.reward-btn {
  padding: 12px 24px;
  background: #1f1f1f;
  color: #fff;
  border: 1px solid #bb86fc;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.reward-btn:hover:enabled {
  background: #bb86fc;
  color: #121212;
}

.reward-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
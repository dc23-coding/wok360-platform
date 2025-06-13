<!-- src/views/RewardsHistory.vue -->
<template>
  <div class="min-h-screen py-8 px-4" :class="theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4 text-center">Rewards History</h1>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-300 dark:border-gray-700">
        <p class="text-lg font-semibold mb-4">
          Total Points Earned: <span class="text-green-400">{{ totalPoints }}</span>
        </p>

        <div v-if="loading" class="text-center text-gray-500">Loading...</div>
        <div v-else-if="rewards.length === 0" class="text-center text-gray-500">No rewards earned yet.</div>

        <div v-else class="space-y-4">
          <div v-for="reward in rewards" :key="reward.id" class="border-b pb-2 border-gray-200 dark:border-gray-600">
            <p class="text-sm text-gray-400">{{ formatDate(reward.created_at) }}</p>
            <p class="font-semibold">Word: {{ reward.word }}</p>
            <p class="text-sm text-green-300">+{{ reward.points }} Points</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface Reward {
  id: string
  user_id: string
  word: string
  points: number
  created_at: string
}

const rewards = ref<Reward[]>([])
const totalPoints = ref<number>(0)
const loading = ref(true)
const theme = ref(localStorage.getItem('theme') || 'light')

const fetchRewards = async () => {
  loading.value = true
  const {
    data,
    error
  } = await supabase
    .from('puzzled_game_rewards')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data?.user?.id)
    .order('created_at', { ascending: false })

  if (!error && data) {
    rewards.value = data
    totalPoints.value = data.reduce((sum, reward) => sum + reward.points, 0)
  }
  loading.value = false
}

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchRewards()
})
</script>

<style scoped>
</style>

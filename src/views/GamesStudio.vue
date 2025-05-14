<template>
  <div class="home-container">
    <div class="particles"></div>
    <div class="menu-bar">
      <span class="menu-tab" @click="goTo('/episodes')">Episodes</span>
      <span class="menu-tab" @click="goTo('/music')">Music</span>
      <span class="menu-tab" @click="goTo('/games-studio')">Games Studio</span>
    </div>

    <div class="orb-row">
      <div v-for="game in games" :key="game.id" class="orb" @click="selectGame(game)">
        <span class="portal-text">{{ game.name }}</span>
      </div>
    </div>

    <div class="wallet-container">
      <button @click="connectMetaMask" :disabled="isConnecting" class="menu-tab">
        {{ walletAddress ? 'Disconnect' : isConnecting ? 'Connecting…' : 'Connect MetaMask' }}
      </button>
      <button v-if="walletAddress" @click="mintNFT" class="menu-tab">Mint Reward NFT</button>
      <p v-if="walletAddress" class="menu-tab">{{ walletAddress }}</p>
      <p v-else-if="walletError" class="menu-tab text-red-500">{{ walletError }}</p>
    </div>

    <div class="menu-bar">Points: {{ points }}</div>
    <transition name="points-popup" @after-leave="resetPointsEarned">
      <div v-if="pointsEarned" class="menu-tab">+{{ pointsEarned }} Points!</div>
    </transition>

    <div class="tablet-container" v-if="activeGame">
      <PuzzledGame v-if="activeGame.id === 'puzzled'" @win="handleGameWin" />
      <TriviaGame v-else-if="activeGame.id === 'trivia'" @win="handleGameWin" />
      <SportsGame v-else-if="activeGame.id === 'sports'" @predictionSubmitted="handleSportsGameWin" />
      <FortuneGame v-else-if="activeGame.id === 'fortune'" @win="handleGameWin" />
      <div v-else class="menu-tab">Game {{ activeGame.name }} coming soon!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ethers } from 'ethers'
import type { JsonFragment } from 'ethers'
import PuzzledGame from '@/components/PuzzledGame.vue'
import TriviaGame from '@/components/TriviaGame.vue'
import SportsGame from '@/components/SportsGame.vue'
import FortuneGame from '@/components/FortuneGame.vue'

interface Game { id: string; name: string }

const contractABI: readonly JsonFragment[] = [
  {
    type: "function",
    name: "mint",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  }
]

const router = useRouter()
const goTo = (path: string) => router.push(path)

const games = ref<Game[]>([
  { id: 'puzzled', name: 'Puzzled' },
  { id: 'trivia', name: 'Trivia' },
  { id: 'sports', name: 'Sports' },
  { id: 'fortune', name: 'Fortune' }
])

const activeGame = ref<Game | null>(null)
const walletAddress = ref<string | null>(null)
const isConnecting = ref(false)
const walletError = ref<string | null>(null)
const points = ref<number>(Number(localStorage.getItem('points')) || 0)
const pointsEarned = ref<number | null>(null)

const selectGame = (game: Game) => {
  activeGame.value = game
}

const resetPointsEarned = () => {
  pointsEarned.value = null
}

const connectMetaMask = async () => {
  if (walletAddress.value) {
    walletAddress.value = null
    walletError.value = null
    return
  }

  if (!(window as any).ethereum) {
    walletError.value = 'MetaMask is not installed. Please install it.'
    return
  }

  try {
    isConnecting.value = true
    const provider = new ethers.BrowserProvider((window as any).ethereum)
    const accounts: string[] = await provider.send('eth_requestAccounts', [])
    walletAddress.value = accounts[0]
    walletError.value = null
  } catch {
    walletError.value = 'Failed to connect MetaMask. Try again.'
  } finally {
    isConnecting.value = false
  }
}

const mintNFT = async () => {
  if (!walletAddress.value) {
    walletError.value = 'Connect wallet first!'
    return
  }

  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum)
    const signer = await provider.getSigner()
    const contractAddress = '0xYourContractAddress'
    const contract = new ethers.Contract(contractAddress, contractABI, signer)
    await contract.mint()
    walletError.value = null
  } catch {
    walletError.value = 'Failed to mint NFT. Try again.'
  }
}

const handleGameWin = () => {
  pointsEarned.value = 10
  points.value += 10
  localStorage.setItem('points', points.value.toString())
}

const handleSportsGameWin = () => handleGameWin()
</script>

<style scoped>
@import './Home.vue';
</style>

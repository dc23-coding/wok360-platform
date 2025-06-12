<template>
  <div
    :class="[
      'min-h-screen flex flex-col relative overflow-hidden',
      theme === 'dark' ? 'bg-gray-900 text-gray-800' : 'bg-gray-100 text-gray-800'
    ]"
  >
    <!-- All UI content -->
    <div class="relative z-50 flex flex-col w-full">
      <!-- Navigation -->
      <nav class="flex justify-center gap-4 mb-4 px-4">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          class="px-3 py-1 rounded font-semibold transition-colors duration-200"
          :class="[
            $route.path === link.path
              ? (theme === 'dark' ? 'bg-blue-600 text-gray-800' : 'bg-blue-500 text-gray-800')
              : (theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300')
          ]"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <!-- Main Card Container -->
      <div
        class="flex flex-col mx-auto w-full max-w-3xl border rounded-lg p-4 shadow-md"
        :class="theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'"
      >
        <!-- Header with visible toggle -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Games</h2>
          <button
            @click="toggleTheme"
            class="px-3 py-1 rounded border font-medium transition"
            :class="theme === 'dark'
              ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'border-gray-400 bg-gray-200 text-gray-800 hover:bg-gray-300'"
          >
            {{ theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}
          </button>
        </div>

        <!-- Wallet / MetaMask Section -->
        <section class="mb-4">
          <div class="flex flex-wrap items-center gap-3 mb-2">
            <button
              :disabled="isConnecting"
              @click="connectMetaMask"
              class="px-4 py-2 rounded font-medium transition"
              :class="[
                walletAddress
                  ? (theme === 'dark'
                      ? 'bg-red-600 text-gray-800 border-red-600 hover:bg-red-700'
                      : 'bg-red-100 text-red-700 border-red-500 hover:bg-red-200')
                  : isConnecting
                    ? 'opacity-50 cursor-not-allowed ' + (theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 border-gray-600'
                        : 'bg-gray-200 text-gray-600 border-gray-300')
                    : (theme === 'dark'
                        ? 'bg-blue-600 text-gray-800 border-blue-600 hover:bg-blue-700'
                        : 'bg-blue-100 text-blue-700 border-blue-500 hover:bg-blue-200')
              ]"
            >
              {{
                walletAddress
                  ? 'Disconnect'
                  : isConnecting
                    ? 'Connecting…'
                    : 'Connect MetaMask'
              }}
            </button>
            <button
              v-if="walletAddress"
              @click="mintNFT"
              class="px-4 py-2 rounded font-medium transition"
              :class="theme === 'dark'
                ? 'bg-green-600 text-gray-800 border-green-600 hover:bg-green-700'
                : 'bg-green-100 text-green-700 border-green-500 hover:bg-green-200'"
            >
              Mint Reward NFT
            </button>
          </div>

          <!-- Display wallet address in its own styled box -->
          <div v-if="walletAddress" class="mt-2 p-3 rounded-lg border transition"
            :class="theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-gray-100'
              : 'bg-gray-50 border-gray-300 text-gray-800'"
          >
            <span class="font-medium">Wallet Address:</span>
            <p class="break-words mt-1">{{ walletAddress }}</p>
          </div>

          <p v-else-if="walletError" class="text-sm text-red-500">
            {{ walletError }}
          </p>
        </section>

        <!-- Rewards / Points Section -->
        <section class="mb-4">
          <h3 class="text-xl font-semibold mb-1">Rewards</h3>
          <p>Points: <span class="font-medium">{{ points }}</span></p>
        </section>

        <!-- Points Popup -->
        <transition name="fade" @after-leave="resetPointsEarned">
          <div
            v-show="pointsEarned"
            class="fixed top-4 right-4 px-3 py-2 rounded shadow-lg font-medium"
            :class="theme === 'dark'
              ? 'bg-yellow-700 text-yellow-100'
              : 'bg-yellow-200 text-yellow-800'"
          >
            +{{ pointsEarned }} Points!
          </div>
        </transition>

        <!-- Games Grid -->
        <section class="mb-4">
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div
                v-for="game in games"
                :key="game.id"
                @click="selectGame(game)"
                class="rounded-lg p-4 text-center cursor-pointer transform transition hover:scale-[1.02] font-medium border"
                :class="[
                  activeGame?.id === game.id
                    ? (theme === 'dark'
                        ? 'bg-blue-700 text-gray-800 border-blue-700 ring-2 ring-blue-400'
                        : 'bg-blue-100 text-blue-800 border-blue-500 ring-2 ring-blue-300')
                    : (theme === 'dark'
                        ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100')
                ]"
              >
                {{ game.name }}
              </div>

          </div>
        </section>

        <!-- Selected Game Embed -->
        <div v-if="activeGame">
          <div
            class="rounded-lg p-4 text-gray-900"
            :class="theme === 'dark'
              ? 'bg-gray-700 border border-gray-600 text-gray-800'
              : 'bg-gray-100 border border-gray-300 text-gray-900'"
          >
            <PuzzledGame
              v-if="activeGame.id === 'puzzled'"
              @win="handleGameWin"
            />
            <TriviaGame
              v-else-if="activeGame.id === 'trivia'"
              @win="handleGameWin"
            />
            <SportsGame
              v-else-if="activeGame.id === 'sports'"
              @predictionSubmitted="handleSportsGameWin"
            />
            <FortuneGame
              v-else-if="activeGame.id === 'fortune'"
              @win="handleGameWin"
            />
            <div
              v-else
              class="text-center font-medium"
              :class="theme === 'dark'
                ? 'text-gray-300'
                : 'text-gray-600'"
            >
              Game “{{ activeGame.name }}” coming soon!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ethers } from 'ethers';
import PuzzledGame from '@/components/PuzzledGame.vue';
import TriviaGame from '@/components/TriviaGame.vue';
import FortuneGame from '@/components/FortuneGame.vue';
import SportsGame from '@/components/SportsGame.vue';

interface Game {
  id: string;
  name: string;
}

// Theme toggling
const theme = ref<string>(localStorage.getItem('theme') || 'light');
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', theme.value);
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
};

// Navigation links
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Episodes', path: '/episodes' },
  { name: 'Music', path: '/music' },
  { name: 'Games', path: '/games' },
];

// Games list
const games = ref<Game[]>([
  { id: 'puzzled', name: 'Puzzled' },
  { id: 'trivia', name: 'Trivia' },
  { id: 'sports', name: 'Sports' },
  { id: 'fortune', name: 'Fortune' },
]);
const activeGame = ref<Game | null>(null);

// Wallet & MetaMask
const walletAddress = ref<string | null>(null);
const isConnecting = ref(false);
const walletError = ref<string | null>(null);

// Points & rewards
const points = ref<number>(Number(localStorage.getItem('points')) || 0);
const gamesPlayed = ref<number>(Number(localStorage.getItem('gamesPlayed')) || 0);
const challengeGoal = 3;
const progress = ref<number>((gamesPlayed.value / challengeGoal) * 100);
const pointsEarned = ref<number | null>(null);

// Fade transition for popup
const resetPointsEarned = () => {
  pointsEarned.value = null;
};

// Connect / disconnect MetaMask
const connectMetaMask = async () => {
  if (walletAddress.value) {
    walletAddress.value = null;
    walletError.value = null;
    return;
  }
  if (!(window as any).ethereum) {
    walletError.value = 'MetaMask is not installed.';
    return;
  }
  try {
    isConnecting.value = true;
    // Use window.ethereum.request if BrowserProvider fails
    const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    walletAddress.value = accounts[0];
    walletError.value = null;
  } catch {
    walletError.value = 'Connection failed.';
  } finally {
    isConnecting.value = false;
  }
};

// Mint NFT
const mintNFT = async () => {
  if (!walletAddress.value) {
    walletError.value = 'Connect wallet first!';
    return;
  }
  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contractAddress = '0xYourContractAddress';
    const contractABI: readonly any[] = [/* your ABI here */];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    await contract.mint();
    walletError.value = null;
  } catch {
    walletError.value = 'Minting failed.';
  }
};

// Select a game
const selectGame = (game: Game) => {
  activeGame.value = game;
};

// Handle game win
const handleGameWin = () => {
  pointsEarned.value = 10;
  points.value += 10;
  gamesPlayed.value += 1;
  progress.value = (gamesPlayed.value / challengeGoal) * 100;
  localStorage.setItem('points', points.value.toString());
  localStorage.setItem('gamesPlayed', gamesPlayed.value.toString());
};

// Sports game win
const handleSportsGameWin = () => {
  handleGameWin();
};

onMounted(() => {
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
});
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  nav {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>

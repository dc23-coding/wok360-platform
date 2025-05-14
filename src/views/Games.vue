<template>
  <div
    :class="[
      'min-h-screen flex flex-col p-6 relative overflow-hidden',
      theme === 'dark' ? 'bg-black text-accent' : 'bg-gray-200 text-gray-900'
    ]"
  >
    <div
      v-if="theme === 'dark'"
      class="absolute inset-0 opacity-10 pointer-events-none grid-background animate-grid-conveyor"
    ></div>
    <Particles
      id="tsparticles"
      :options="particleOptions"
      class="absolute inset-0 z-0"
    />
    <nav ref="headerNav" class="flex justify-center gap-6 mb-6 z-10">
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.path"
        class="nav-orb menu-button text-lg font-semibold"
        :class="{ active: $route.path === link.path }"
      >
        {{ link.name }}
      </router-link>
    </nav>
    <div class="main-content max-w-4xl mx-auto w-full">
      <div
        class="tablet-container bg-surfaceLight dark:bg-surfaceDark border border-accent shadow-[0_0_20px_var(--accent)] rounded-lg p-6"
      >
        <button
          class="mb-4 px-4 py-2 rounded border border-accent text-accent glitch hover:shadow-[0_0_15px_var(--accent)]"
          @click="toggleTheme"
        >
          {{ theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <section class="wallet-container mb-6 text-accent">
          <button
            :disabled="isConnecting"
            @click="connectMetaMask"
            class="px-4 py-3 rounded border border-accent text-inherit glitch hover:shadow-[0_0_15px_var(--accent)]"
            :class="{ connected: walletAddress }"
          >
            {{ walletAddress ? 'Disconnect' : isConnecting ? 'Connecting…' : 'Connect MetaMask' }}
          </button>
          <button
            v-if="walletAddress"
            @click="mintNFT"
            class="ml-4 px-4 py-3 rounded border border-accent text-inherit glitch hover:shadow-[0_0_15px_var(--accent)]"
          >
            Mint Reward NFT
          </button>
          <p v-if="walletAddress" class="mt-2 break-all text-sm text-inherit">
            {{ walletAddress }}
          </p>
          <p v-else-if="walletError" class="mt-2 text-sm text-red-500">
            {{ walletError }}
          </p>
        </section>
        <section class="rewards-container mb-6 text-accent">
          <h3 class="text-xl font-semibold glitch mb-2">Rewards</h3>
          <p class="mb-1">Points: {{ points }}</p>
        </section>
        <transition name="points-popup" @after-leave="resetPointsEarned">
          <div v-if="pointsEarned" class="points-popup">+{{ pointsEarned }} Points!</div>
        </transition>
        <section class="games-grid grid grid-cols-2 gap-4">
          <div
            v-for="game in games"
            :key="game.id"
            class="game-box bg-white dark:bg-surfaceDark text-accent border border-accent shadow-[0_0_15px_var(--accent)] rounded-lg p-4 text-center cursor-pointer transition-transform duration-300 hover:scale-105"
            :class="{ active: activeGame?.id === game.id }"
            @click="selectGame(game)"
          >
            {{ game.name }}
          </div>
        </section>
        <div
          v-if="activeGame"
          class="game-embed-container mt-6 bg-surfaceLight dark:bg-surfaceDark border border-accent rounded-lg p-4 relative"
        >
          <PuzzledGame v-if="activeGame.id === 'puzzled'" @win="handleGameWin" />
          <TriviaGame v-else-if="activeGame.id === 'trivia'" @win="handleGameWin" />
          <SportsGame v-else-if="activeGame.id === 'sports'" @predictionSubmitted="handleSportsGameWin" />
          <FortuneGame v-else-if="activeGame.id === 'fortune'" @win="handleGameWin" />
          <div v-else class="placeholder">Game {{ activeGame.name }} coming soon!</div>
          <div v-if="showRain" class="absolute inset-0 opacity-20 pointer-events-none animate-matrix-rain"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ethers } from 'ethers';
import Particles from '@tsparticles/vue3';
import PuzzledGame from '@/components/PuzzledGame.vue';
import TriviaGame from '@/components/TriviaGame.vue';
import FortuneGame from '@/components/FortuneGame.vue';
import SportsGame from '@/components/SportsGame.vue';

gsap.registerPlugin(ScrollTrigger);

interface Game {
  id: string;
  name: string;
}

const theme = ref<string>(localStorage.getItem('theme') || 'dark');
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', theme.value);
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
};

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Episodes', path: '/episodes' },
  { name: 'Music', path: '/music' },
  { name: 'Games', path: '/games' },
];

const games = ref<Game[]>([
  { id: 'puzzled', name: 'Puzzled' },
  { id: 'trivia', name: 'Trivia' },
  { id: 'sports', name: 'Sports' },
  { id: 'fortune', name: 'Fortunate' },
]);

const route = useRoute();
const activeGame = ref<Game | null>(null);

const walletAddress = ref<string | null>(null);
const isConnecting = ref(false);
const walletError = ref<string | null>(null);

const points = ref<number>(Number(localStorage.getItem('points')) || 0);
const gamesPlayed = ref<number>(Number(localStorage.getItem('gamesPlayed')) || 0);
const challengeGoal = 3;
const progress = ref<number>((gamesPlayed.value / challengeGoal) * 100);

const showRain = ref(false);
const pointsEarned = ref<number | null>(null);

const particleOptions = ref({
  background: {
    color: {
      value: theme.value === 'dark' ? '#000000' : '#E5E7EB',
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'repulse',
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: '#00BFFF',
    },
    links: {
      color: '#00BFFF',
      distance: 150,
      enable: true,
      opacity: 0.4,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'bounce',
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 50,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
});

const resetPointsEarned = () => {
  pointsEarned.value = null;
};

const connectMetaMask = async () => {
  if (walletAddress.value) {
    walletAddress.value = null;
    walletError.value = null;
    return;
  }

  if (!(window as any).ethereum) {
    walletError.value = 'MetaMask is not installed. Please install it.';
    return;
  }

  try {
    isConnecting.value = true;
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const accounts: string[] = await provider.send('eth_requestAccounts', []);
    walletAddress.value = accounts[0];
    walletError.value = null;
  } catch (error: any) {
    walletError.value = 'Failed to connect MetaMask. Try again.';
  } finally {
    isConnecting.value = false;
  }
};

const mintNFT = async () => {
  if (!walletAddress.value) {
    walletError.value = 'Connect wallet first!';
    return;
  }

  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contractAddress = '0xYourContractAddress';
    const contractABI: readonly any[] = [
      // Add your contract ABI here, e.g.:
      // "function mint() public"
    ];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    await contract.mint();
    walletError.value = null;
  } catch (error: any) {
    walletError.value = 'Failed to mint NFT. Try again.';
  }
};

const selectGame = (game: Game) => {
  activeGame.value = game;
};

const handleGameWin = () => {
  pointsEarned.value = 10;
  points.value += 10;
  gamesPlayed.value += 1;
  progress.value = (gamesPlayed.value / challengeGoal) * 100;
  localStorage.setItem('points', points.value.toString());
  localStorage.setItem('gamesPlayed', gamesPlayed.value.toString());
};

const handleSportsGameWin = () => {
  handleGameWin();
};

onMounted(() => {
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
});
</script>
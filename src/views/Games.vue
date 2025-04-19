<template>
  <div class="games text-white min-h-screen flex p-6">
    <div id="particles-js" class="particles"></div>

    <nav class="nav-orb-container left">
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.path"
        class="nav-orb"
        :class="{ active: $route.path === link.path }"
      >
        {{ link.name }}
      </router-link>
    </nav>

    <div class="main-content">
      <div class="tablet-container">
        <section class="wallet-container">
          <button
            :disabled="isConnecting"
            @click="connectMetaMask"
            :class="{ connected: walletAddress }"
          >
            {{ walletAddress ? 'Disconnect' : isConnecting ? 'Connecting...' : 'Connect MetaMask' }}
          </button>
          <p v-if="walletAddress" class="wallet-address">{{ walletAddress }}</p>
          <p v-else-if="walletError" class="wallet-error">{{ walletError }}</p>
        </section>

        <section class="rewards-container">
          <h3>Rewards</h3>
          <p>Points: {{ points }}</p>
          <div class="progress-bar" :style="{ '--progress': `${progress}%` }">
            <div class="progress-fill"></div>
          </div>
          <p>Daily Challenge: Play {{ challengeGoal - gamesPlayed }} more games today!</p>
        </section>

        <section class="games-grid">
          <div
            v-for="game in games"
            :key="game.id"
            class="game-box"
            :class="{ active: activeGame?.id === game.id }"
            @click="selectGame(game)"
          >
            {{ game.name }}
          </div>
        </section>

        <div v-if="activeGame" class="game-embed-container">
          <PuzzledGame v-if="activeGame.id === 'puzzled'" @win="handleGameWin" />
          <TriviaGame v-else-if="activeGame.id === 'trivia'" @win="handleGameWin" />
          <SportsGame
            v-else-if="activeGame.id === 'sports'"
            @predictionSubmitted="handleSportsGameWin"
          />
          <FortuneGame v-else-if="activeGame.id === 'fortune'" @win="handleGameWin" />
          <div v-else class="placeholder">Game {{ activeGame.name }} coming soon!</div>
        </div>
      </div>
    </div>

    <nav class="nav-orb-container right">
      <button
        v-for="game in games"
        :key="game.id"
        @click="selectGame(game)"
        class="nav-orb"
        :class="{ active: activeGame?.id === game.id }"
      >
        {{ game.name }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import PuzzledGame from '../components/PuzzledGame.vue';
import TriviaGame from '../components/TriviaGame.vue';
import FortuneGame from '../components/FortuneGame.vue';
import SportsGame from '../components/SportsGame.vue';

interface Game {
  id: string;
  name: string;
}

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
const points = ref(Number(localStorage.getItem('points')) || 0);
const gamesPlayed = ref(Number(localStorage.getItem('gamesPlayed')) || 0);
const challengeGoal = 3;
const progress = ref((gamesPlayed.value / challengeGoal) * 100);

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
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    walletAddress.value = accounts[0];
    walletError.value = null;
  } catch (error: any) {
    walletError.value = 'Failed to connect MetaMask. Try again.';
  } finally {
    isConnecting.value = false;
  }
};

const selectGame = (game: Game) => {
  activeGame.value = game;
};

const handleGameWin = () => {
  points.value += 10;
  gamesPlayed.value += 1;
  progress.value = Math.min((gamesPlayed.value / challengeGoal) * 100, 100);
  localStorage.setItem('points', points.value.toString());
  localStorage.setItem('gamesPlayed', gamesPlayed.value.toString());
};

const handleSportsGameWin = (predictions: Record<number, string>) => {
  points.value += 10;
  gamesPlayed.value += 1;
  progress.value = Math.min((gamesPlayed.value / challengeGoal) * 100, 100);
  localStorage.setItem('points', points.value.toString());
  localStorage.setItem('gamesPlayed', gamesPlayed.value.toString());
};
</script>

<style scoped src="@/styles/games.css"></style>

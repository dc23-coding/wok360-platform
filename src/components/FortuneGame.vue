<!-- components/FortuneGame.vue -->
<template>
    <div class="fortune-game">
      <h3>Fortune</h3>
      <!-- Draw Button -->
      <div class="draw-container">
        <button
          @click="drawOutcome"
          class="draw-button"
          :disabled="isDrawing || gameWon || gameOver"
        >
          Fortune Draw
        </button>
        <div v-if="drawResult" class="draw-result">
          {{ drawResult.label }}
        </div>
      </div>
      <!-- Phrase -->
      <div class="phrase">
        <div
          v-for="(letter, index) in displayPhrase"
          :key="index"
          class="letter"
          :class="{ revealed: letter !== '_' }"
        >
          {{ letter }}
        </div>
      </div>
      <!-- Keyboard -->
      <div class="keyboard">
        <button
          v-for="letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')"
          :key="letter"
          @click="guessLetter(letter)"
          :class="{ used: usedLetters[letter] }"
          :disabled="!!isDrawing || !!gameWon || !!gameOver || !!usedLetters[letter] || !!drawResult"

        >
          {{ letter }}
        </button>
      </div>
      <!-- Score & Status -->
      <div class="status">
        <p>Score: {{ score }} points</p>
        <p>Wrong Guesses: {{ wrongCount }}/6</p>
        <p v-if="gameWon">You won! +{{ score + 1000 }} points</p>
        <p v-else-if="gameOver">Game over! Answer: {{ targetPhrase }}</p>
        <button v-if="gameWon || gameOver" @click="resetGame" class="play-again">
          Play Again
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const emit = defineEmits(['win']);
  
  interface DrawOutcome {
    label: string;
    value: number | string;
  }
  
  const drawOutcomes: DrawOutcome[] = [
    { label: '100 Points', value: 100 },
    { label: '200 Points', value: 200 },
    { label: '500 Points', value: 500 },
    { label: '1000 Points', value: 1000 },
    { label: 'Double Score', value: '2x' },
    { label: 'Lose Turn', value: 'lose' },
    { label: 'Bankrupt', value: 'bankrupt' },
    { label: 'Free Guess', value: 'free' },
  ];
  
  const phrases = ['HELLO', 'GAME SHOW', 'FORTUNE', 'SPIN WHEEL'];
  const targetPhrase = ref('');
  const displayPhrase = ref<string[]>([]);
  const usedLetters = ref<Record<string, string>>({});
  const wrongCount = ref(0);
  const score = ref(0);
  const gameWon = ref(false);
  const gameOver = ref(false);
  const isDrawing = ref(false);
  const drawResult = ref<DrawOutcome | null>(null);
  
  const initGame = () => {
    targetPhrase.value = phrases[Math.floor(Math.random() * phrases.length)];
    displayPhrase.value = targetPhrase.value
      .split('')
      .map((char) => (char === ' ' ? ' ' : '_'));
    usedLetters.value = {};
    wrongCount.value = 0;
    score.value = 0;
    gameWon.value = false;
    gameOver.value = false;
    isDrawing.value = false;
    drawResult.value = null;
    console.log('Fortune initialized, phrase:', targetPhrase.value);
  };
  
  const drawOutcome = () => {
    if (isDrawing.value) return;
    isDrawing.value = true;
  
    const randomIndex = Math.floor(Math.random() * drawOutcomes.length);
    drawResult.value = drawOutcomes[randomIndex];
  
    setTimeout(() => {
      isDrawing.value = false;
      if (drawResult.value) {
        console.log('Draw result:', drawResult.value.label);
        if (drawResult.value.value === 'bankrupt') {
          score.value = 0;
          console.log('Bankrupt, score reset');
        } else if (drawResult.value.value === 'lose') {
          wrongCount.value++;
          console.log('Lose turn, wrong:', wrongCount.value);
          checkGameOver();
          drawResult.value = null;
        } else if (drawResult.value.value === 'free') {
          console.log('Free guess');
        }
      }
    }, 500);
  };
  
  const guessLetter = (letter: string) => {
    if (
      isDrawing.value ||
      gameWon.value ||
      gameOver.value ||
      usedLetters.value[letter] ||
      !drawResult.value
    )
      return;
  
    usedLetters.value[letter] = targetPhrase.value.includes(letter) ? 'correct' : 'absent';
    let letterCount = 0;
  
    if (targetPhrase.value.includes(letter)) {
      displayPhrase.value = targetPhrase.value.split('').map((char, i) => {
        if (char === letter) {
          letterCount++;
          return char;
        }
        return displayPhrase.value[i];
      });
      if (typeof drawResult.value.value === 'number') {
        score.value += drawResult.value.value * letterCount;
      } else if (drawResult.value.value === '2x') {
        score.value *= 2;
      } else if (drawResult.value.value === 'free') {
        // Free guess: No points
      }
      console.log('Correct letter:', letter, 'score:', score.value);
    } else if (drawResult.value.value !== 'free') {
      wrongCount.value++;
      console.log('Wrong letter:', letter, 'wrong:', wrongCount.value);
    }
  
    drawResult.value = null;
    checkGameStatus();
  };
  
  const checkGameStatus = () => {
    if (!displayPhrase.value.includes('_')) {
      gameWon.value = true;
      score.value += 1000;
      emit('win');
      console.log('Game won, score:', score.value);
    } else if (wrongCount.value >= 6) {
      gameOver.value = true;
      console.log('Game over');
    }
  };
  
  const checkGameOver = () => {
    if (wrongCount.value >= 6) {
      gameOver.value = true;
      console.log('Game over from lose turn');
    }
  };
  
  const resetGame = () => {
    initGame();
    console.log('Fortune reset');
  };
  
  onMounted(() => {
    initGame();
    console.log('FortuneGame.vue mounted');
  });
  </script>
  
  <style scoped>
  .fortune-game {
    text-align: center;
    color: #fff;
  }
  .fortune-game h3 {
    color: #bb86fc;
    margin-bottom: 1rem;
  }
  .draw-container {
    margin: 0 auto 2rem;
  }
  .draw-button {
    background: #bb86fc;
    color: #121212;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.3s;
  }
  .draw-button:hover {
    transform: scale(1.05);
    background: #6200ea;
  }
  .draw-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .draw-result {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: #1a1a1a;
    border: 2px solid #bb86fc;
    border-radius: 8px;
    color: #bb86fc;
    font-weight: bold;
    animation: fadeIn 0.5s ease-in;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .phrase {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  .letter {
    width: 40px;
    height: 40px;
    border-bottom: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    text-transform: uppercase;
  }
  .letter.revealed {
    border-color: #bb86fc;
    color: #bb86fc;
  }
  .keyboard {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    max-width: 600px;
    margin: 1rem auto;
  }
  .keyboard button {
    background: #333;
    color: #fff;
    border: none;
    padding: 0.5rem;
    width: 40px;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
  }
  .keyboard button.used.correct {
    background: #bb86fc;
  }
  .keyboard button.used.absent {
    background: #555;
  }
  .keyboard button:not(.used):hover {
    background: #444;
  }
  .keyboard button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .status {
    margin-top: 1rem;
  }
  .status p {
    color: #bb86fc;
    margin: 0.5rem 0;
  }
  .play-again {
    background: #bb86fc;
    color: #121212;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.3s, background 0.3s;
  }
  .play-again:hover {
    transform: scale(1.05);
    background: #6200ea;
  }
  @media (max-width: 768px) {
    .letter {
      width: 30px;
      height: 30px;
      font-size: 1.2rem;
    }
    .draw-result {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 480px) {
    .letter {
      width: 25px;
      height: 25px;
      font-size: 1rem;
    }
    .draw-result {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
  }
  </style>
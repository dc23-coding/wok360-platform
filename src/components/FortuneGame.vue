<template>
  <div class="fortune-game">
    <h2>🔮 Fortune Game</h2>

    <!-- Category Display -->
    <p v-if="category">Category: <strong>{{ category }}</strong></p>

    <!-- Puzzle Display -->
    <div class="puzzle-display">
      <span v-for="(char, index) in displayedPuzzle" :key="index" class="puzzle-letter">
        {{ guessedLetters.includes(char.toUpperCase()) ? char : (char === ' ' ? ' ' : '_') }}
      </span>
    </div>

    <!-- Guess Logs -->
    <div class="guess-logs">
      <p><strong>❌ Wrong Guesses:</strong> {{ wrongGuesses.join(', ') || 'None yet' }}</p>
      <p><strong>🤖 AI Guesses:</strong> {{ aiGuesses.join(', ') || 'None yet' }}</p>
    </div>

    <!-- Spin Wheel -->
    <button @click="spinWheel" :disabled="!isPlayerTurn || wheelSpinning || gameOver">🎡 Spin the Wheel</button>
    <p v-if="wheelResult">Result: <strong>{{ wheelResultText }}</strong></p>

    <!-- Player Letter Guess -->
    <div v-if="isPlayerTurn && wheelResult && wheelResult.type === 'points'">
      <input v-model="letterGuess" maxlength="1" placeholder="Guess a letter" />
      <button @click="guessLetter">Guess</button>
    </div>

    <!-- AI Turn Indicator -->
    <p v-if="!isPlayerTurn && !gameOver">🤖 AI is thinking...</p>

    <!-- Scoreboard -->
    <div class="scoreboard">
      <p>🧍 You: {{ playerScore }} pts (Strikes: {{ playerStrikes }})</p>
      <p>🤖 AI: {{ aiScore }} pts</p>
    </div>
    <p><strong>Current Turn:</strong> {{ isPlayerTurn ? '🧍 You' : '🤖 AI' }}</p>

    <!-- Solve Puzzle -->
    <div v-if="isPlayerTurn && !gameOver">
      <input v-model="playerSolution" placeholder="Solve the puzzle" />
      <button @click="submitSolution">Submit Solution</button>
    </div>

    <!-- Game Over -->
    <p v-if="gameOver"><strong>{{ winner }} wins!</strong></p>
    <p v-if="gameOver && currentPuzzle"><strong>🧩 The answer was:</strong> {{ currentPuzzle }}</p>
    <button v-if="gameOver" @click="resetGame">🔁 Play Again</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Categories & Puzzles
const categories = [
  'Truck Stop Lingo',
  'Movie Titles',
  'U.S. State Capitals',
  '90s Slang',
  'Song Lyrics',
  'AI & Tech Terms',
  'Fast Food Favorites',
];

const puzzles: Record<string, string[]> = {
  'Truck Stop Lingo': ['HAMMER DOWN', 'CHICKEN COOP', '10 FOUR'],
  'Movie Titles': ['THE GODFATHER', 'FORREST GUMP'],
  'U.S. State Capitals': ['ATLANTA', 'AUSTIN', 'SACRAMENTO'],
  '90s Slang': ['BOOYAH', 'ALL THAT', 'TALK TO THE HAND'],
  'Song Lyrics': ['HIT ME BABY ONE MORE TIME', 'I WANT IT THAT WAY'],
  'AI & Tech Terms': ['MACHINE LEARNING', 'NEURAL NETWORK'],
  'Fast Food Favorites': ['BIG MAC', 'CRUNCHWRAP SUPREME'],
};

// Game State
const category = ref('');
const currentPuzzle = ref('');
const guessedLetters = ref<string[]>([]);
const aiGuesses = ref<string[]>([]);
const letterGuess = ref('');
const wheelResult = ref<{ type: string; value?: number } | null>(null);

const isPlayerTurn = ref(true);
const playerScore = ref(0);
const aiScore = ref(0);
const playerStrikes = ref(0);
const maxStrikes = 5;
const playerSolution = ref('');
const gameOver = ref(false);
const winner = ref('');
const wheelSpinning = ref(false);

const displayedPuzzle = computed(() => currentPuzzle.value.split(''));

const wrongGuesses = computed(() =>
  guessedLetters.value.filter((l) => !currentPuzzle.value.includes(l))
);

const wheelResultText = computed(() => {
  if (!wheelResult.value) return '';
  return wheelResult.value.type === 'points'
    ? `${wheelResult.value.value} points`
    : wheelResult.value.type === 'bankrupt'
    ? '💸 Bankrupt!'
    : '⛔ Lose Turn';
});

// Setup
const chooseCategory = () => {
  category.value = categories[Math.floor(Math.random() * categories.length)];
  const options = puzzles[category.value];
  currentPuzzle.value = options[Math.floor(Math.random() * options.length)];
};

// Wheel Spin
const spinWheel = () => {
  wheelSpinning.value = true;
  setTimeout(() => {
    const outcomes = [
      { type: 'points', value: 100 },
      { type: 'points', value: 200 },
      { type: 'points', value: 500 },
      { type: 'bankrupt' },
      { type: 'loseTurn' },
    ];
    wheelResult.value = outcomes[Math.floor(Math.random() * outcomes.length)];
    wheelSpinning.value = false;

    if (wheelResult.value.type === 'bankrupt') {
      playerScore.value = 0;
      endTurn();
    } else if (wheelResult.value.type === 'loseTurn') {
      playerStrikes.value++;
      if (playerStrikes.value >= maxStrikes) {
        gameOver.value = true;
        winner.value = '🤖 AI';
      } else {
        endTurn();
      }
    }
  }, 1000);
};

// Player Guess
const guessLetter = () => {
  const letter = letterGuess.value.toUpperCase();
  if (!letter || guessedLetters.value.includes(letter)) return;

  guessedLetters.value.push(letter);

  if (currentPuzzle.value.includes(letter)) {
    const count = currentPuzzle.value.split('').filter((l) => l === letter).length;
    playerScore.value += (wheelResult.value?.value || 0) * count;

    if (checkPuzzleComplete()) {
      gameOver.value = true;
      winner.value = '🧍 You';
    }
  } else {
    playerStrikes.value++;
    if (playerStrikes.value >= maxStrikes) {
      gameOver.value = true;
      winner.value = '🤖 AI';
    } else {
      endTurn();
    }
  }

  letterGuess.value = '';
};

// Puzzle Solve
const submitSolution = () => {
  if (playerSolution.value.toUpperCase() === currentPuzzle.value) {
    gameOver.value = true;
    winner.value = '🧍 You';
    playerScore.value += 1000;
  } else {
    playerStrikes.value++;
    if (playerStrikes.value >= maxStrikes) {
      gameOver.value = true;
      winner.value = '🤖 AI';
    } else {
      endTurn();
    }
  }
  playerSolution.value = '';
};

// End Turn
const endTurn = () => {
  isPlayerTurn.value = false;
  setTimeout(aiTurn, 1200);
};

// AI Logic
const aiTurn = () => {
  if (gameOver.value) return;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const available = alphabet.split('').filter((l) => !guessedLetters.value.includes(l));
  const guess = available[Math.floor(Math.random() * available.length)];

  guessedLetters.value.push(guess);
  aiGuesses.value.push(guess);

  const count = currentPuzzle.value.split('').filter((l) => l === guess).length;

  if (count > 0) {
    aiScore.value += count * 100;
    if (checkPuzzleComplete()) {
      gameOver.value = true;
      winner.value = '🤖 AI';
    } else {
      setTimeout(aiTurn, 1000); // AI guesses again
    }
  } else {
    isPlayerTurn.value = true;
    wheelResult.value = null;
  }
};

// Check Win Condition
const checkPuzzleComplete = () => {
  return currentPuzzle.value.split('').every((char) => {
    return char === ' ' || guessedLetters.value.includes(char);
  });
};

// Reset Game
const resetGame = () => {
  guessedLetters.value = [];
  aiGuesses.value = [];
  letterGuess.value = '';
  playerSolution.value = '';
  playerScore.value = 0;
  aiScore.value = 0;
  playerStrikes.value = 0;
  isPlayerTurn.value = true;
  wheelResult.value = null;
  gameOver.value = false;
  winner.value = '';
  chooseCategory();
};

// Start Game
onMounted(chooseCategory);
</script>

<style scoped>
.fortune-game {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
.puzzle-display {
  font-size: 2rem;
  letter-spacing: 0.5rem;
  margin: 1rem 0;
}
.puzzle-letter {
  display: inline-block;
  width: 1.5rem;
}
.scoreboard, .guess-logs {
  margin: 1rem 0;
}
</style>

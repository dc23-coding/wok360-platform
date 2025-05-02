<template>
  <div class="game-container" :class="{ 'ai-turn': !isPlayerTurn }">
    <div class="game-header">
      <h1>🎡 Wheel of Wonders</h1>
      <div class="player-progress">
        <div class="level-display">Level {{ level }} - Puzzle {{ puzzleNumber }}/5</div>
        <div class="xp-bar">
          <div class="xp-progress" :style="{ width: playerXP + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="game-board">
      <!-- Category & Puzzle Display -->
      <div class="puzzle-area">
        <div class="category-badge" v-if="category">
          <span class="category-icon">{{ categoryIcons[category] }}</span>
          {{ category }}
        </div>
        <div class="puzzle-display">
          <span 
            v-for="(char, index) in displayedPuzzle" 
            :key="index" 
            class="puzzle-letter"
            :class="{
              'revealed': guessedLetters.includes(char.toUpperCase()),
              'space': char === ' ',
              'just-guessed': lastCorrectGuess === char.toUpperCase()
            }"
          >
            {{ guessedLetters.includes(char.toUpperCase()) ? char : (char === ' ' ? ' ' : '_') }}
          </span>
        </div>
      </div>

      <!-- Wheel Visualization -->
      <div class="wheel-container" @click="spinWheel" :class="{ spinning: wheelSpinning }">
        <div class="wheel" :style="{ transform: `rotate(${wheelRotation}deg)` }">
          <div 
            v-for="(slice, index) in wheelSlices" 
            :key="index" 
            class="wheel-slice"
            :style="{ 
              backgroundColor: slice.color,
              transform: `rotate(${index * wheelSliceAngle}deg)`
            }"
          >
            <span class="slice-value">{{ slice.label }}</span>
          </div>
        </div>
        <div class="wheel-pointer"></div>
      </div>
    </div>

    <!-- Game Controls -->
    <div class="controls">
      <div class="wheel-result" v-if="wheelResult">
        <div class="result-badge" :class="wheelResult.type">
          {{ wheelResultText }}
          <span v-if="wheelResult.type === 'points'" class="result-value">+{{ wheelResult.value }}</span>
        </div>
      </div>

      <div class="guess-section" v-if="isPlayerTurn && !gameOver">
        <div class="letter-guess" v-if="wheelResult && wheelResult.type === 'points'">
          <input 
            v-model="letterGuess" 
            maxlength="1" 
            placeholder="Guess a letter" 
            ref="guessInput"
            @keyup.enter="guessLetter"
          />
          <button @click="guessLetter" :disabled="!letterGuess">
            <span class="button-icon">🔍</span> Guess
          </button>
        </div>
        
        <div class="solve-puzzle">
          <input 
            v-model="playerSolution" 
            placeholder="Solve the puzzle (optional)" 
            @keyup.enter="submitSolution"
          />
          <button @click="submitSolution" :disabled="!playerSolution">
            <span class="button-icon">🏆</span> Solve
          </button>
        </div>
      </div>

      <button 
        class="spin-button" 
        @click="spinWheel" 
        :disabled="!isPlayerTurn || wheelSpinning || gameOver"
      >
        <span v-if="wheelSpinning" class="spinner">🌀</span>
        <span v-else>🎡 SPIN THE WHEEL</span>
      </button>
    </div>

    <!-- Game Status -->
    <div class="status-panel">
      <div class="scoreboard">
        <div class="player-score">
          <span class="player-icon">🧑</span>
          <span class="score-value">{{ playerScore }}</span>
          <div class="strikes">
            <span 
              v-for="n in maxStrikes" 
              :key="n" 
              :class="{ active: n <= playerStrikes }"
            >⚡</span>
          </div>
        </div>
        <div class="ai-score">
          <span class="ai-icon">🤖</span>
          <span class="score-value">{{ aiScore }}</span>
        </div>
      </div>

      <div class="guess-history">
        <div class="wrong-guesses">
          <h3>❌ Misses</h3>
          <div class="guess-bubbles">
            <span v-for="(guess, index) in wrongGuesses" :key="index" class="wrong-guess">
              {{ guess }}
            </span>
          </div>
        </div>
        <div class="ai-guesses">
          <h3>🤖 AI Moves</h3>
          <div class="guess-bubbles">
            <span 
              v-for="(guess, index) in aiGuesses" 
              :key="index" 
              class="ai-guess"
              :class="{ correct: currentPuzzle.includes(guess) }"
            >
              {{ guess }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Over Modal -->
    <div class="game-over-modal" v-if="gameOver">
      <div class="modal-content">
        <h2>{{ winner }} WINS!</h2>
        <p class="puzzle-answer">The answer was: <strong>{{ currentPuzzle }}</strong></p>
        
        <div class="reward-display" v-if="winner === '🧑 You'">
          <div class="xp-earned">+{{ calculateXPEarned() }} XP</div>
          <div class="bonus-message" v-if="perfectRound">Perfect Round Bonus!</div>
        </div>
        
        <div class="action-buttons">
          <button @click="nextPuzzle" v-if="puzzleNumber < 5">
            <span class="button-icon">⏭️</span> Next Puzzle
          </button>
          <button @click="resetGame" v-else>
            <span class="button-icon">🔁</span> Play Again
          </button>
          <button @click="shareScore">
            <span class="button-icon">📢</span> Share
          </button>
        </div>
      </div>
    </div>

    <!-- Tutorial Modal -->
    <div class="tutorial-modal" v-if="showTutorial">
      <div class="modal-content">
        <h2>How to Play</h2>
        <div class="tutorial-steps">
          <div class="step">
            <span class="step-icon">🎡</span>
            <p><strong>Spin the wheel</strong> to get points or special effects</p>
          </div>
          <div class="step">
            <span class="step-icon">🔤</span>
            <p><strong>Guess letters</strong> to reveal the puzzle (earn points for correct guesses)</p>
          </div>
          <div class="step">
            <span class="step-icon">🏆</span>
            <p><strong>Solve the puzzle</strong> to win the round and earn bonus XP</p>
          </div>
          <div class="step">
            <span class="step-icon">⚡</span>
            <p>Avoid <strong>5 strikes</strong> or the AI wins!</p>
          </div>
        </div>
        <button @click="startGame">Got It! Start Playing</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

// Enhanced Game Data
const categories = [
  'Truck Stop Lingo',
  'Movie Titles',
  'U.S. State Capitals',
  '90s Slang',
  'Song Lyrics',
  'AI & Tech Terms',
  'Fast Food Favorites',
  'Video Games',
  'Famous Inventors',
  'Internet Culture'
];

const categoryIcons = {
  'Truck Stop Lingo': '🚛',
  'Movie Titles': '🎬',
  'U.S. State Capitals': '🏛️',
  '90s Slang': '📼',
  'Song Lyrics': '🎵',
  'AI & Tech Terms': '🤖',
  'Fast Food Favorites': '🍔',
  'Video Games': '🎮',
  'Famous Inventors': '🧪',
  'Internet Culture': '🌐'
};

const puzzles: Record<string, string[]> = {
  'Truck Stop Lingo': ['HAMMER DOWN', 'CHICKEN COOP', '10 FOUR', 'BEAR IN THE AIR', 'ALLIGATOR ALLEY'],
  'Movie Titles': ['THE GODFATHER', 'FORREST GUMP', 'THE SHAWSHANK REDEMPTION', 'PULP FICTION', 'THE DARK KNIGHT'],
  'U.S. State Capitals': ['ATLANTA', 'AUSTIN', 'SACRAMENTO', 'TALLAHASSEE', 'OLYMPIA'],
  '90s Slang': ['BOOYAH', 'ALL THAT', 'TALK TO THE HAND', 'AS IF', 'WHATEVER'],
  'Song Lyrics': ['HIT ME BABY ONE MORE TIME', 'I WANT IT THAT WAY', 'SMOOTH CRIMINAL', 'LIKE A PRAYER'],
  'AI & Tech Terms': ['MACHINE LEARNING', 'NEURAL NETWORK', 'LARGE LANGUAGE MODEL', 'DEEP LEARNING'],
  'Fast Food Favorites': ['BIG MAC', 'CRUNCHWRAP SUPREME', 'WHOPPER', 'CHICKEN NUGGETS'],
  'Video Games': ['THE LEGEND OF ZELDA', 'FINAL FANTASY', 'CALL OF DUTY', 'MINECRAFT'],
  'Famous Inventors': ['THOMAS EDISON', 'NIKOLA TESLA', 'MARIE CURIE', 'GRACE HOPPER'],
  'Internet Culture': ['GOAT', 'TLDR', 'SMALL PP ENERGY', 'TOUCH GRASS']
};

// Wheel Configuration
const wheelSlices = [
  { type: 'points', value: 300, label: '300', color: '#FF6B6B' },
  { type: 'points', value: 450, label: '450', color: '#4ECDC4' },
  { type: 'points', value: 200, label: '200', color: '#FFE66D' },
  { type: 'points', value: 500, label: '500', color: '#A5DD9B' },
  { type: 'points', value: 100, label: '100', color: '#FFA5A5' },
  { type: 'points', value: 400, label: '400', color: '#84D2C5' },
  { type: 'bankrupt', label: 'BANKRUPT', color: '#FF9F1C' },
  { type: 'loseTurn', label: 'LOSE TURN', color: '#FF6392' },
  { type: 'points', value: 250, label: '250', color: '#7BDCB5' },
  { type: 'points', value: 150, label: '150', color: '#C5A3FF' },
  { type: 'bonus', label: 'BONUS', color: '#FF9F9F' },
  { type: 'double', label: 'DOUBLE', color: '#A0E7E5' }
];

const wheelSliceAngle = 360 / wheelSlices.length;

// Game State
const category = ref('');
const currentPuzzle = ref('');
const guessedLetters = ref<string[]>([]);
const aiGuesses = ref<string[]>([]);
const letterGuess = ref('');
const wheelResult = ref<{ type: string; value?: number } | null>(null);
const lastCorrectGuess = ref('');
const wheelRotation = ref(0);
const wheelSpinning = ref(false);

const isPlayerTurn = ref(true);
const playerScore = ref(0);
const aiScore = ref(0);
const playerStrikes = ref(0);
const maxStrikes = 5;
const playerSolution = ref('');
const gameOver = ref(false);
const winner = ref('');
const showTutorial = ref(true);

// Progression System
const level = ref(1);
const playerXP = ref(0);
const puzzleNumber = ref(1);
const perfectRound = ref(false);

// Computed Properties
const displayedPuzzle = computed(() => currentPuzzle.value.split(''));
const wrongGuesses = computed(() => guessedLetters.value.filter(l => !currentPuzzle.value.includes(l)));
const puzzleComplete = computed(() => {
  return currentPuzzle.value.split('').every(char => {
    return char === ' ' || guessedLetters.value.includes(char);
  });
});

const wheelResultText = computed(() => {
  if (!wheelResult.value) return '';
  switch(wheelResult.value.type) {
    case 'points': return `${wheelResult.value.value} Points`;
    case 'bankrupt': return '💸 BANKRUPT!';
    case 'loseTurn': return '⛔ LOSE TURN';
    case 'bonus': return '🎁 BONUS ROUND!';
    case 'double': return '✖️ DOUBLE POINTS!';
    default: return '';
  }
});

// Game Setup
const chooseCategoryAndPuzzle = () => {
  category.value = categories[Math.floor(Math.random() * categories.length)];
  const options = puzzles[category.value];
  currentPuzzle.value = options[Math.floor(Math.random() * options.length)];
  guessedLetters.value = [];
  aiGuesses.value = [];
  wheelResult.value = null;
  lastCorrectGuess.value = '';
  perfectRound.value = true;
};

const startGame = () => {
  showTutorial.value = false;
  chooseCategoryAndPuzzle();
};

// Wheel Mechanics
const spinWheel = () => {
  if (!isPlayerTurn.value || wheelSpinning.value || gameOver.value) return;

  wheelSpinning.value = true;
  letterGuess.value = '';
  
  // Random spin with momentum effect
  const spinDegrees = 1800 + Math.floor(Math.random() * 360);
  wheelRotation.value += spinDegrees;
  
  setTimeout(() => {
    const normalizedRotation = wheelRotation.value % 360;
    const sliceIndex = Math.floor(normalizedRotation / wheelSliceAngle);
    const selectedSlice = wheelSlices[wheelSlices.length - 1 - sliceIndex];
    
    wheelResult.value = { type: selectedSlice.type, value: selectedSlice.value };
    wheelSpinning.value = false;

    // Handle special wheel results
    switch(selectedSlice.type) {
      case 'bankrupt':
        playerScore.value = 0;
        endTurn();
        break;
      case 'loseTurn':
        playerStrikes.value++;
        checkStrikes();
        break;
      case 'bonus':
        playerScore.value += 1000;
        break;
      case 'double':
        // Next correct guess is worth double
        break;
    }
    
    // Auto-focus input if player can guess
    if (wheelResult.value.type === 'points' || wheelResult.value.type === 'double') {
      setTimeout(() => {
        const input = document.querySelector('input') as HTMLInputElement;
        input?.focus();
      }, 100);
    }
  }, 4000); // Match this with CSS animation duration
};

// Player Actions
const guessLetter = () => {
  const letter = letterGuess.value.toUpperCase();
  if (!letter || guessedLetters.value.includes(letter)) return;

  guessedLetters.value.push(letter);

  if (currentPuzzle.value.includes(letter)) {
    // Calculate points with potential modifiers
    let pointsPerLetter = wheelResult.value?.value || 100;
    if (wheelResult.value?.type === 'double') pointsPerLetter *= 2;
    
    const count = currentPuzzle.value.split('').filter(l => l === letter).length;
    playerScore.value += pointsPerLetter * count;
    lastCorrectGuess.value = letter;

    if (puzzleComplete.value) {
      endRound(true);
    }
  } else {
    playerStrikes.value++;
    checkStrikes();
  }

  letterGuess.value = '';
};

const submitSolution = () => {
  if (playerSolution.value.toUpperCase() === currentPuzzle.value) {
    endRound(true);
  } else {
    playerStrikes.value++;
    checkStrikes();
  }
  playerSolution.value = '';
};

// Game Flow
const checkStrikes = () => {
  if (playerStrikes.value >= maxStrikes) {
    endRound(false);
  } else {
    endTurn();
  }
};

const endTurn = () => {
  isPlayerTurn.value = false;
  setTimeout(aiTurn, 1500);
};

const aiTurn = () => {
  if (gameOver.value) return;

  // Smarter AI that guesses more likely letters first
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');
  
  // Combine and filter out guessed letters
  const remainingVowels = vowels.filter(l => !guessedLetters.value.includes(l));
  const remainingConsonants = consonants.filter(l => !guessedLetters.value.includes(l));
  
  // AI strategy: guess vowels first, then consonants
  const guessPool = [...remainingVowels, ...remainingConsonants];
  if (guessPool.length === 0) return;
  
  const guess = guessPool[Math.floor(Math.random() * guessPool.length)];
  
  guessedLetters.value.push(guess);
  aiGuesses.value.push(guess);

  const count = currentPuzzle.value.split('').filter(l => l === guess).length;

  if (count > 0) {
    aiScore.value += count * 100;
    if (puzzleComplete.value) {
      endRound(false);
    } else {
      setTimeout(aiTurn, 1000); // AI gets another turn
    }
  } else {
    isPlayerTurn.value = true;
    wheelResult.value = null;
  }
};

const endRound = (playerWon: boolean) => {
  gameOver.value = true;
  winner.value = playerWon ? '🧑 You' : '🤖 AI';
  
  if (playerWon) {
    // Calculate XP earned
    const xpEarned = calculateXPEarned();
    playerXP.value = Math.min(playerXP.value + xpEarned, 100);
    
    // Check for level up
    if (playerXP.value >= 100) {
      level.value++;
      playerXP.value = 0;
    }
  }
};

const calculateXPEarned = () => {
  let xp = 50; // Base XP
  
  // Bonus for quick solve
  const lettersGuessed = guessedLetters.value.filter(l => currentPuzzle.value.includes(l)).length;
  if (lettersGuessed <= 3) xp += 30;
  
  // Bonus for no strikes
  if (playerStrikes.value === 0) {
    xp += 20;
    perfectRound.value = true;
  }
  
  // Bonus for high score
  if (playerScore.value > aiScore.value * 2) xp += 10;
  
  return xp;
};

const nextPuzzle = () => {
  puzzleNumber.value++;
  gameOver.value = false;
  playerStrikes.value = 0;
  isPlayerTurn.value = true;
  wheelResult.value = null;
  
  if (puzzleNumber.value > 5) {
    level.value++;
    puzzleNumber.value = 1;
  }
  
  chooseCategoryAndPuzzle();
};

const resetGame = () => {
  playerScore.value = 0;
  aiScore.value = 0;
  playerStrikes.value = 0;
  level.value = 1;
  playerXP.value = 0;
  puzzleNumber.value = 1;
  gameOver.value = false;
  isPlayerTurn.value = true;
  chooseCategoryAndPuzzle();
};

const shareScore = () => {
  // In a real app, this would use the Web Share API or social media SDKs
  alert(`I just scored ${playerScore.value} points in Wheel of Wonders! Can you beat me?`);
};

// Initialize
onMounted(() => {
  if (!showTutorial.value) {
    chooseCategoryAndPuzzle();
  }
});
</script>

<style scoped>
/* Base Styles */
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.game-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.game-header h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.player-progress {
  background: #e0e5ec;
  border-radius: 10px;
  padding: 0.5rem;
  margin: 0 auto;
  max-width: 400px;
}

.level-display {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.xp-bar {
  height: 10px;
  background: #dfe6e9;
  border-radius: 5px;
  overflow: hidden;
}

.xp-progress {
  height: 100%;
  background: linear-gradient(90deg, #00b894, #55efc4);
  transition: width 0.5s ease;
}

/* Game Board Layout */
.game-board {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.puzzle-area {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #2c3e50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.category-icon {
  font-size: 1.2rem;
}

.puzzle-display {
  font-size: 2.2rem;
  letter-spacing: 0.5rem;
  margin: 1.5rem 0;
  font-weight: bold;
  min-height: 3rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.puzzle-letter {
  display: inline-block;
  width: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.puzzle-letter.revealed {
  color: #00b894;
  transform: translateY(-5px);
}

.puzzle-letter.just-guessed {
  color: #0984e3;
  transform: scale(1.2);
}

.puzzle-letter.space {
  width: 1rem;
}

/* Wheel Styles */
.wheel-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  cursor: pointer;
  transition: transform 0.2s;
}

.wheel-container:hover:not(.spinning) {
  transform: scale(1.03);
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.wheel-slice {
  position: absolute;
  width: 50%;
  height: 50%;
  left: 0;
  top: 0;
  transform-origin: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.slice-value {
  transform: rotate(45deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.wheel-pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #ff7675;
  z-index: 10;
}

/* Controls Section */
.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.wheel-result {
  min-height: 3rem;
}

.result-badge {
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  animation: popIn 0.5s ease;
}

.result-badge.points {
  background: linear-gradient(135deg, #00b894, #55efc4);
}

.result-badge.bankrupt {
  background: linear-gradient(135deg, #ff7675, #fdcb6e);
}

.result-badge.loseTurn {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
}

.result-badge.bonus {
  background: linear-gradient(135deg, #fd79a8, #e84393);
}

.result-badge.double {
  background: linear-gradient(135deg, #0984e3, #74b9ff);
}

.result-value {
  margin-left: 0.5rem;
  font-size: 1.4rem;
}

.guess-section {
  width: 100%;
  max-width: 500px;
}

.letter-guess, .solve-puzzle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.letter-guess input, .solve-puzzle input {
  flex-grow: 1;
  padding: 0.8rem 1rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.3s;
}

.letter-guess input:focus, .solve-puzzle input:focus {
  outline: none;
  border-color: #74b9ff;
}

.letter-guess button, .solve-puzzle button {
  padding: 0 1.5rem;
  background: #0984e3;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.letter-guess button:hover, .solve-puzzle button:hover {
  background: #0767b3;
}

.letter-guess button:disabled, .solve-puzzle button:disabled {
  background: #b2bec3;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.2rem;
}

.spin-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
  width: 100%;
  max-width: 300px;
}

.spin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
}

.spin-button:disabled {
  background: #b2bec3;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

/* Status Panel */
.status-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.scoreboard {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dfe6e9;
}

.player-score, .ai-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
}

.player-icon, .ai-icon {
  font-size: 1.5rem;
}

.score-value {
  font-weight: bold;
  color: #2d3436;
}

.strikes {
  display: flex;
  gap: 0.3rem;
  margin-left: 1rem;
}

.strikes span {
  color: #b2bec3;
  font-size: 1rem;
}

.strikes span.active {
  color: #ff7675;
}

.guess-history {
  display: flex;
  gap: 1.5rem;
}

.wrong-guesses, .ai-guesses {
  flex: 1;
}

.guess-history h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #636e72;
}

.guess-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.wrong-guess, .ai-guess {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  background: #dfe6e9;
  color: #636e72;
}

.ai-guess.correct {
  background: #55efc4;
  color: #006442;
}

/* Game Over Modal */
.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  animation: modalIn 0.5s ease;
}

.modal-content h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.puzzle-answer {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #636e72;
}

.reward-display {
  margin: 1.5rem 0;
}

.xp-earned {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00b894;
  margin-bottom: 0.5rem;
}

.bonus-message {
  color: #0984e3;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.action-buttons button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-buttons button:first-child {
  background: #00b894;
  color: white;
}

.action-buttons button:last-child {
  background: #0984e3;
  color: white;
}

.action-buttons button:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

/* Tutorial Modal */
.tutorial-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.tutorial-steps {
  margin: 2rem 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.step-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.step p {
  margin: 0;
  font-size: 1.1rem;
}

.tutorial-modal button {
  padding: 1rem 2rem;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.tutorial-modal button:hover {
  background: #5649c0;
  transform: translateY(-2px);
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes modalIn {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .game-board {
    gap: 1.5rem;
  }
  
  .wheel-container {
    width: 250px;
    height: 250px;
  }
  
  .puzzle-display {
    font-size: 1.8rem;
    letter-spacing: 0.3rem;
  }
  
  .guess-history {
    flex-direction: column;
    gap: 1rem;
  }
}

/* AI Turn Indicator */
.game-container.ai-turn::after {
  content: "🤖 AI's Turn";
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
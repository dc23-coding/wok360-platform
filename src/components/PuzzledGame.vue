<template>
  <div class="puzzled-game" :class="theme === 'dark' ? 'text-white' : 'text-black'">
    <h3 class="text-xl font-semibold mb-4">Puzzled</h3>

    <div class="grid mb-4">
      <div v-for="row in 6" :key="row" class="row">
        <div
          v-for="col in 5"
          :key="`${row}-${col}`"
          class="cell"
          :class="getCellClass(row - 1, col - 1)"
        >
          {{ getCellLetter(row - 1, col - 1) }}
        </div>
      </div>
    </div>

    <div class="keyboard mb-6">
      <div class="kb-row">
        <button
          v-for="key in qwertyRow1"
          :key="key"
          @click="typeLetter(key)"
          :class="['kb-btn', usedLetters[key], theme]"
          :disabled="gameWon || gameOver"
        >
          {{ key }}
        </button>
      </div>
      <div class="kb-row">
        <button
          v-for="key in qwertyRow2"
          :key="key"
          @click="typeLetter(key)"
          :class="['kb-btn', usedLetters[key], theme]"
          :disabled="gameWon || gameOver"
        >
          {{ key }}
        </button>
      </div>
      <div class="kb-row">
        <button class="kb-btn wide" @click="submitGuess" :disabled="gameWon || gameOver">Enter</button>
        <button
          v-for="key in qwertyRow3"
          :key="key"
          @click="typeLetter(key)"
          :class="['kb-btn', usedLetters[key], theme]"
          :disabled="gameWon || gameOver"
        >
          {{ key }}
        </button>
        <button class="kb-btn wide" @click="deleteLetter" :disabled="gameWon || gameOver">Del</button>
      </div>
    </div>

    <!-- COLOR LEGEND SECTION (Hints for Users) -->
    <div class="color-legend flex justify-center flex-wrap gap-4 mb-4">
      <div class="legend-item">
        <div class="legend-box correct"></div>
        <span>Correct spot</span>
      </div>
      <div class="legend-item">
        <div class="legend-box present"></div>
        <span>Wrong spot</span>
      </div>
      <div class="legend-item">
        <div class="legend-box absent"></div>
        <span>Not in word</span>
      </div>
    </div>

    <div v-if="gameWon || gameOver" class="game-result mt-4">
      <p v-if="gameWon" class="text-green-500 font-semibold mb-2">You won! +{{ pointsAwarded }} points</p>
      <p v-else class="text-red-500 font-semibold mb-2">Game over! Answer: {{ targetWord }}</p>
      <button @click="resetGame" class="play-again kb-btn">Play Again</button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { addGamePoints } from '@/composables/usePoints'

const props = defineProps<{ theme: string }>()
const emit = defineEmits<{
  (e: 'win', points: number): void
}>()

const words = [
  'AUDIO', 'BLAZE', 'CHARM', 'DREAM', 'EAGLE', 'FAITH',
  'GRACE', 'HEART', 'IVORY', 'JOKER', 'KARMA', 'LUCKY',
  'MAGIC', 'NOBLE', 'OASIS', 'PRIZE', 'QUEST', 'ROVER',
  'SOLAR', 'TRUST', 'UNITY', 'VIBES', 'WASTE', 'WAVES',
  'YOUTH', 'ZEBRA', 'APPLE', 'BRAVE', 'CROWN', 'DANCE',
  'FLAME', 'HAPPY', 'JUMPY', 'ECHO', 'VIVID', 'LEVEL',
  'MISTY', 'OCEAN', 'PEARL', 'QUIRK', 'ULTRA', 'SHINE', 'TWIST'
]

const targetWord = ref('')
const guesses = ref<string[]>(Array(6).fill(''))
const currentRow = ref(0)
const currentGuess = ref('')
const gameWon = ref(false)
const gameOver = ref(false)
const usedLetters = ref<Record<string, string>>({})
const pointsAwarded = ref(0)

const qwertyRow1 = 'QWERTYUIOP'.split('')
const qwertyRow2 = 'ASDFGHJKL'.split('')
const qwertyRow3 = 'ZXCVBNM'.split('')

const initGame = () => {
  targetWord.value = words[Math.floor(Math.random() * words.length)]
  guesses.value = Array(6).fill('')
  currentRow.value = 0
  currentGuess.value = ''
  gameWon.value = false
  gameOver.value = false
  usedLetters.value = {}
  pointsAwarded.value = 0
}

const resetGame = () => initGame()

const typeLetter = (letter: string) => {
  if (currentGuess.value.length < 5 && !gameWon.value && !gameOver.value) {
    currentGuess.value += letter
  }
}

const deleteLetter = () => {
  if (currentGuess.value.length > 0 && !gameWon.value && !gameOver.value) {
    currentGuess.value = currentGuess.value.slice(0, -1)
  }
}

const getWordScore = (word: string): number => {
  const counts: Record<string, number> = {}
  for (const char of word) {
    counts[char] = (counts[char] || 0) + 1
  }
  const duplicates = Object.values(counts).filter(c => c > 1)
  const maxRepeat = Math.max(0, ...duplicates)
  if (maxRepeat >= 4) return 40
  if (maxRepeat === 2) return 20
  return 10
}

const submitGuess = () => {
  if (currentGuess.value.length !== 5 || gameWon.value || gameOver.value) return

  guesses.value[currentRow.value] = currentGuess.value

  for (let i = 0; i < 5; i++) {
    const letter = currentGuess.value[i]
    usedLetters.value[letter] = getCellClass(currentRow.value, i)
  }

  
  

  if (currentGuess.value === targetWord.value) {
    gameWon.value = true
    const score = getWordScore(currentGuess.value)
    pointsAwarded.value = score
    emit('win', score)

    // Light up keyboard keys as green
    for (const letter of currentGuess.value) {
      usedLetters.value[letter] = 'correct'
    }
  } else if (currentRow.value === 5) {
    gameOver.value = true
  } else {
    currentRow.value++
    currentGuess.value = ''
  }
}

const getCellClass = (row: number, col: number) => {
  if (!guesses.value[row]) return ''
  const letter = guesses.value[row][col]
  const isSubmitted = row < currentRow.value || (row === currentRow.value && (gameWon.value || gameOver.value))
  if (!isSubmitted) return ''
  if (gameWon.value && row === currentRow.value) return 'correct'
  if (targetWord.value[col] === letter) return 'correct'
  if (targetWord.value.includes(letter)) return 'present'
  return 'absent'
}

const getCellLetter = (row: number, col: number) => {
  if (row > currentRow.value) return ''
  if (row === currentRow.value) return currentGuess.value[col] || ''
  return guesses.value[row][col] || ''
}

onMounted(() => initGame())
</script>

<style scoped>
/* identical styling from previous version including legend */
.puzzled-game { display: flex; flex-direction: column; align-items: center; }
.grid { display: grid; grid-template-rows: repeat(6, 1fr); gap: 8px; }
.row { display: flex; gap: 8px; }
.cell {
  width: 50px; height: 50px; border: 2px solid #ccc;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 1.2rem; border-radius: 4px;
  background-color: #fff; color: #000;
}
.correct { background-color: #34d399; border-color: #34d399; color: #000; }
.present { background-color: #fbbf24; border-color: #fbbf24; color: #000; }
.absent { background-color: #d1d5db; border-color: #d1d5db; color: #000; }
.keyboard { display: flex; flex-direction: column; gap: 6px; margin-top: 16px; }
.kb-row { display: flex; justify-content: center; gap: 6px; }
.kb-btn {
  padding: 10px 12px; font-weight: bold; border: none; border-radius: 6px;
  background-color: #e5e7eb; color: #000; cursor: pointer;
  transition: background-color 0.2s ease;
}
.kb-btn:hover { background-color: #d1d5db; }
.kb-btn.correct { background-color: #34d399; color: #000; }
.kb-btn.present { background-color: #fbbf24; color: #000; }
.kb-btn.absent { background-color: #9ca3af; color: #000; }
.kb-btn.wide { padding: 10px 16px; }
.play-again { margin-top: 12px; }
.color-legend { margin-top: 12px; }
.legend-item { display: flex; align-items: center; gap: 6px; margin: 4px 8px; }
.legend-box {
  width: 20px; height: 20px; border-radius: 4px; display: inline-block;
}
.legend-box.correct { background-color: #34d399; }
.legend-box.present { background-color: #fbbf24; }
.legend-box.absent { background-color: #9ca3af; }
.game-result { text-align: center; }
</style>


<style scoped>
.puzzled-game {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 8px;
}

.row {
  display: flex;
  gap: 8px;
}

.cell {
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 4px;
  background-color: #fff;
  color: #000;
}

.correct {
  background-color: #34d399;
  border-color: #34d399;
  color: #000;
}

.present {
  background-color: #fbbf24;
  border-color: #fbbf24;
  color: #000;
}

.absent {
  background-color: #d1d5db;
  border-color: #d1d5db;
  color: #000;
}

.keyboard {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 16px;
}

.kb-row {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.kb-btn {
  padding: 10px 12px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  background-color: #e5e7eb;
  color: #000;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.kb-btn:hover {
  background-color: #d1d5db;
}

.kb-btn.correct {
  background-color: #34d399;
  color: #000;
}

.kb-btn.present {
  background-color: #fbbf24;
  color: #000;
}

.kb-btn.absent {
  background-color: #9ca3af;
  color: #000;
}

.kb-btn.wide {
  padding: 10px 16px;
}

.play-agaistyle {
  margin-top: 12px;
}


.color-legend {
  margin-top: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 8px;
}

.legend-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
}

.legend-box.correct {
  background-color: #34d399;
}

.legend-box.present {
  background-color: #fbbf24;
}

.legend-box.absent {
  background-color: #9ca3af;
}

.game-result {
  text-align: center;
}
</style>

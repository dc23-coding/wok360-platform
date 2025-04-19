<template>
  <div class="puzzled-game">
    <h3>Puzzled</h3>
    <div class="grid">
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

    <div class="keyboard">
      <button
        v-for="letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')"
        :key="letter"
        @click="typeLetter(letter)"
        :class="{ used: usedLetters[letter] }"
        :disabled="gameWon || gameOver"
      >
        {{ letter }}
      </button>
      <button @click="submitGuess" :disabled="gameWon || gameOver">Enter</button>
      <button @click="deleteLetter" :disabled="gameWon || gameOver">Del</button>
    </div>

    <div v-if="gameWon || gameOver" class="game-result">
      <p v-if="gameWon">You won! +10 points</p>
      <p v-else>Game over! Answer: {{ targetWord }}</p>
      <button @click="resetGame" class="play-again">Play Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import '../styles/puzzled.css';

const emit = defineEmits(['win'])

const words = ['CRANE', 'AUDIO', 'VISTA', 'FRESH', 'GLINT']
const targetWord = ref('')
const guesses = ref<string[]>(Array(6).fill(''))
const currentRow = ref(0)
const currentGuess = ref('')
const gameWon = ref(false)
const gameOver = ref(false)
const usedLetters = ref<Record<string, string>>({})

const initGame = () => {
  targetWord.value = words[Math.floor(Math.random() * words.length)]
  guesses.value = Array(6).fill('')
  currentRow.value = 0
  currentGuess.value = ''
  gameWon.value = false
  gameOver.value = false
  usedLetters.value = {}
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

const submitGuess = () => {
  if (currentGuess.value.length !== 5 || gameWon.value || gameOver.value) return

  guesses.value[currentRow.value] = currentGuess.value

  for (let i = 0; i < 5; i++) {
    const letter = currentGuess.value[i]
    if (targetWord.value[i] === letter) {
      usedLetters.value[letter] = 'correct'
    } else if (targetWord.value.includes(letter) && !usedLetters.value[letter]) {
      usedLetters.value[letter] = 'present'
    } else if (!usedLetters.value[letter]) {
      usedLetters.value[letter] = 'absent'
    }
  }

  if (currentGuess.value === targetWord.value) {
    gameWon.value = true
    emit('win')
  } else if (currentRow.value === 5) {
    gameOver.value = true
  } else {
    currentRow.value++
    currentGuess.value = ''
  }
}

const getCellClass = (row: number, col: number) => {
  if (row >= currentRow.value || !guesses.value[row]) return ''
  const letter = guesses.value[row][col]
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
<style scoped src="../styles/puzzled.css"></style>

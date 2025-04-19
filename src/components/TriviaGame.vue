<template>
    <div class="trivia-game">
      <h3>Trivia</h3>
  
      <div v-if="loading">Loading questions...</div>
      <div v-else-if="error">{{ error }}</div>
  
      <div v-else>
        <div v-if="!gameOver">
          <p>
            Question {{ currentQuestion + 1 }} of {{ questions.length }}:<br />
            <span v-html="decodeHTML(questions[currentQuestion].question)"></span>
          </p>
  
          <div class="options">
            <button
              v-for="(option, index) in shuffledOptions"
              :key="index"
              @click="selectOption(option)"
              :disabled="selected"
            >
              {{ decodeHTML(option) }}
            </button>
          </div>
  
          <p v-if="selected && isCorrect">✅ Correct!</p>
          <p v-if="selected && !isCorrect">❌ Wrong! Correct: {{ decodeHTML(correctAnswer) }}</p>
  
          <button v-if="selected && !gameOver" @click="nextQuestion" class="next-btn">
            Next Question
          </button>
        </div>
  
        <div v-else>
          <p>You answered {{ score }} out of {{ questions.length }} correctly!</p>
          <p>+{{ score * 10 }} points earned</p>
          <button @click="resetGame" class="play-again">Play Again</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  
  const emit = defineEmits(['win']);
  
  interface TriviaQuestion {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }
  
  const questions = ref<TriviaQuestion[]>([]);
  const shuffledOptions = ref<string[]>([]);
  const currentQuestion = ref(0);
  const score = ref(0);
  const selected = ref(false);
  const isCorrect = ref(false);
  const gameOver = ref(false);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const correctAnswer = ref('');
  
  const fetchQuestions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');
      const data = await res.json();
      questions.value = data.results;
      shuffleOptions();
    } catch (err) {
      error.value = 'Failed to load trivia questions.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  
  const shuffleOptions = () => {
    const q = questions.value[currentQuestion.value];
    if (!q) return;
    correctAnswer.value = q.correct_answer;
    const allOptions = [...q.incorrect_answers, q.correct_answer];
    shuffledOptions.value = allOptions.sort(() => Math.random() - 0.5);
    selected.value = false;
  };
  
  const selectOption = (option: string) => {
    selected.value = true;
    isCorrect.value = option === correctAnswer.value;
    if (isCorrect.value) {
      score.value++;
    }
  };
  
  const nextQuestion = () => {
    selected.value = false;
    isCorrect.value = false;
  
    if (currentQuestion.value < questions.value.length - 1) {
      currentQuestion.value++;
      shuffleOptions();
    } else {
      gameOver.value = true;
      emit('win', score.value); // optional: emit score to parent
    }
  };
  
  const resetGame = () => {
    currentQuestion.value = 0;
    score.value = 0;
    gameOver.value = false;
    selected.value = false;
    isCorrect.value = false;
    fetchQuestions();
  };
  
  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  
  onMounted(() => {
    fetchQuestions();
  });
  </script>
  
  <style scoped>
  .trivia-game {
    text-align: center;
    color: #fff;
  }
  .trivia-game h3 {
    color: #bb86fc;
    margin-bottom: 1rem;
  }
  .trivia-game p {
    color: #fff;
    margin-bottom: 1rem;
  }
  .options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .options button {
    background: #333;
    color: #fff;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
  }
  .options button:hover {
    background: #444;
  }
  .options button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .play-again,
  .next-btn {
    background: #bb86fc;
    color: #121212;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.3s, background 0.3s;
  }
  .play-again:hover,
  .next-btn:hover {
    transform: scale(1.05);
    background: #6200ea;
  }
  </style>
  
<template>
    <div class="games bg-black text-white min-h-screen flex flex-col items-center justify-center p-6">
      <h2 class="text-4xl font-bold mb-6 text-center">Karma Games</h2>
      <p class="mb-8 text-lg text-center max-w-2xl">
        Play and earn! Test your mind with puzzles, games, and Karma-powered challenges.
        First up: <strong>Puzzled</strong>, a Wordle-style brain tickler.
      </p>
  
      <!-- Embed Puzzled React App via iframe -->
      <iframe
        src="http://localhost:8080/"
        class="w-full max-w-3xl h-[600px] rounded-lg border border-gray-700 shadow-lg"
      >
      </iframe>
    </div>
  </template>
  
  <script setup lang="ts">
  // Static link while you're in dev. Update to external or built path when deploying.
  </script>
  
  <style scoped>
  .games {
    background: radial-gradient(circle at center, #0f0f0f, #000);
  }
  </style>
  
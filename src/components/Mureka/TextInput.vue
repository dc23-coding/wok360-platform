<template>
  <div class="max-w-2xl mx-auto mt-12 space-y-6">
    <h1 class="text-3xl font-bold text-center">📝 Enter Your Lyrics</h1>
    <textarea
      v-model="lyrics"
      placeholder="Type your lyrics here..."
      class="border border-gray-300 rounded px-3 py-2 w-full h-32"
    />
    <div class="mt-4 text-center">
      <p class="text-muted-foreground">Preview:</p>
      <p class="italic">{{ lyrics }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const lyrics = ref('');
</script>

<template>
  <div class="max-w-2xl mx-auto mt-12 space-y-6 text-center">
    <h1 class="text-3xl font-bold">🎤 Record Your Audio</h1>
    <p class="text-muted-foreground">Use your device microphone to capture a vocal idea.</p>

    <button
      @click="startRecording"
      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Start Recording
    </button>

    <p v-if="recording" class="mt-2 text-red-600">Recording... (not really implemented)</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const recording = ref(false);

function startRecording() {
  console.log('Recording started');
  recording.value = true;
  setTimeout(() => {
    recording.value = false;
  }, 3000);
}
</script>

<template>
  <div class="max-w-2xl mx-auto mt-12 space-y-6 text-center">
    <h1 class="text-3xl font-bold">📤 Upload Your Audio File</h1>
    <input type="file" @change="handleFileUpload" class="block mx-auto mb-4" />
    <p v-if="fileName" class="mt-2">Uploaded file: <strong>{{ fileName }}</strong></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const fileName = ref('');

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    fileName.value = file.name;
    console.log('Uploaded file:', file.name);
  }
}
</script>

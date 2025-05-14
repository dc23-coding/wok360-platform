<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">Mureka Studio Home</h1>

    <div class="border border-gray-200 rounded shadow p-4 bg-white mb-4">
      <p>Welcome to the studio! Try our new components below.</p>
    </div>

    <input
      v-model="inputText"
      type="text"
      placeholder="Type something..."
      class="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
    />

    <button @click="openModal" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Open Modal
    </button>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-2">Hello from Modal!</h2>
        <p>This is a sample modal using Vue.</p>
        <button @click="closeModal" class="mt-4 text-blue-600 underline">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const inputText = ref('');
const isModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

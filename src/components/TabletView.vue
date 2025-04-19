<template>
    <div class="tablet-view w-full h-full bg-black text-white p-6">
      <h2 class="text-3xl font-bold mb-6 text-center">Your Episodes</h2>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="episode in episodes"
          :key="episode.id"
          class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer"
          @click="selectEpisode(episode)"
        >
          <img :src="episode.thumbnail" :alt="episode.title" class="w-full h-40 object-cover" />
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{{ episode.title }}</h3>
            <p class="text-sm text-gray-300">{{ episode.description }}</p>
          </div>
        </div>
      </div>
  
      <!-- Modal or Overlay for selected episode (optional for now) -->
      <div v-if="activeEpisode" class="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
        <div class="bg-gray-900 rounded-lg p-8 max-w-lg w-full">
          <h3 class="text-2xl font-bold mb-2">{{ activeEpisode.title }}</h3>
          <p class="mb-4 text-gray-300">{{ activeEpisode.description }}</p>
          <video controls class="w-full rounded" v-if="activeEpisode.video">
            <source :src="activeEpisode.video" type="video/mp4" />
            Your browser does not support video.
          </video>
          <button @click="activeEpisode = null" class="mt-4 px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Episode {
    id: number
    title: string
    description: string
    thumbnail: string
    video?: string
  }
  
  const episodes = ref<Episode[]>([
    {
      id: 1,
      title: 'Episode 1: The Awakening',
      description: 'Your journey begins here.',
      thumbnail: '/images/sun-group.svg',
      video: '/video/episode1.mp4'
    },
    {
      id: 2,
      title: 'Episode 2: Digital Drift',
      description: 'Uncover the data of lost civilizations.',
      thumbnail: '/images/planetary.png',
      video: '/video/episode2.mp4'
    },
    {
      id: 3,
      title: 'Episode 3: Karma Protocol',
      description: 'Explore the system that powers your world.',
      thumbnail: '/images/1Logo.png',
      video: '/video/episode3.mp4'
    }
  ])
  
  const activeEpisode = ref<Episode | null>(null)
  
  function selectEpisode(ep: Episode) {
    activeEpisode.value = ep
  }
  </script>
  
  <style scoped>
  .tablet-view {
    min-height: 100vh;
  }
  </style>
  
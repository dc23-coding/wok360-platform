<template>
  <div class="episodes-studio bg-black text-white min-h-screen flex flex-col items-center justify-start p-6">
    <!-- Top Navigation Orbs -->
    <div class="nav-orb-container flex gap-4 mb-4">
      <router-link v-for="link in navLinks" :key="link.name" :to="link.path" class="nav-orb">
        {{ link.name }}
      </router-link>
    </div>

    <!-- Centered 1920x1080 Video Player -->
    <div class="video-wrapper w-full flex justify-center items-center mb-6">
      <div class="video-container">
        <iframe
          v-if="activeContent"
          ref="videoPlayer"
          :src="activeContent.videoUrl"
          frameborder="0"
          allowfullscreen
          class="video-frame"
        ></iframe>
        <div v-else class="placeholder text-gray-400 text-center">
          Select an episode or podcast to begin
        </div>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="category-section flex flex-wrap gap-2 mb-4">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        class="category-btn"
        :class="{ active: selectedCategory === category }"
      >
        {{ category }}
      </button>
    </div>

    <!-- Episode List -->
    <div class="episode-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl">
      <div
        v-for="episode in filteredEpisodes"
        :key="episode.id"
        @click="selectContent(episode)"
        class="episode-card"
      >
        <h3 class="font-semibold">{{ episode.title }}</h3>
        <p class="text-sm text-gray-400">{{ episode.description }}</p>
      </div>
    </div>

    <!-- Podcast Grid -->
    <section class="latest-episodes mt-8 w-full max-w-7xl">
      <h2 class="text-2xl font-bold mb-4 text-center">Podcast Episodes</h2>
      <div class="episode-grid flex overflow-x-auto gap-4 pb-2">
        <div v-for="podcast in podcasts" :key="podcast.id" class="podcast-card min-w-[250px]">
          <h3 class="font-semibold">{{ podcast.title }}</h3>
          <p class="text-sm text-gray-400">{{ podcast.description }}</p>
          <button @click="selectContent(podcast)" class="btn mt-2">Watch Now</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Episode { id: number; type: 'episode'; title: string; description: string; videoUrl: string; categories: string[] }
interface Podcast { id: number; type: 'podcast'; title: string; description: string; videoUrl: string }

const navLinks = [ { name: 'Home', path: '/home' }, { name: 'Episodes', path: '/episodes' }, { name: 'Music', path: '/music' }, { name: 'Games', path: '/games' } ]

const categories = ['All', 'Political', 'Blockchain', 'Investing', 'Entertainment']
const selectedCategory = ref('All')

const episodes = ref<Episode[]>([
  { id: 1, type: 'episode', title: 'No Souls At The Poles', description: 'Exploring the mysteries beyond the ice.', videoUrl: 'https://www.youtube.com/embed/UkcP_TM9ytE', categories: ['Political', 'Entertainment'] },
  { id: 2, type: 'episode', title: 'We Gone Ball', description: 'A high-energy dive into the grind.', videoUrl: 'https://www.youtube.com/embed/oLSvwaDd3H8', categories: ['Entertainment'] },
  { id: 3, type: 'episode', title: 'Freestyle Freddy', description: 'Raw rhymes and real talk.', videoUrl: 'https://www.youtube.com/embed/jp1vwODYfHI', categories: ['Entertainment'] },
  { id: 4, type: 'episode', title: 'Really Wanna See', description: 'Chasing visions and breaking limits.', videoUrl: 'https://www.youtube.com/embed/bQ3I-84S90M', categories: ['Investing', 'Entertainment'] },
])

const podcasts = ref<Podcast[]>([
  { id: 1, type: 'podcast', title: 'Episode 1', description: 'Discussion on current events.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: 2, type: 'podcast', title: 'Episode 2', description: 'Deep dive into finance.', videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0' },
  { id: 3, type: 'podcast', title: 'Episode 3', description: 'Debate on technology trends.', videoUrl: 'https://www.youtube.com/embed/kXYiU_JCYtU' },
])

const activeContent = ref<Episode | Podcast | null>(null)
const selectContent = (content: Episode | Podcast) => activeContent.value = content
const selectCategory = (category: string) => selectedCategory.value = category

const filteredEpisodes = computed(() => selectedCategory.value === 'All'
  ? episodes.value
  : episodes.value.filter(e => e.categories.includes(selectedCategory.value))
)

watch(activeContent, (newContent) => {
  if (newContent && newContent.videoUrl) console.log('Video Loaded:', newContent.videoUrl)
})
</script>

<style scoped>
.video-wrapper { width: 100%; display: flex; justify-content: center; align-items: center; }
.video-container { width: 1920px; height: 1080px; background: #000; display: flex; justify-content: center; align-items: center; }
.video-frame { width: 100%; height: 100%; }
.placeholder { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: #888; }

.nav-orb { width: 60px; height: 60px; background: #6200ea; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #fff; cursor: pointer; }
.nav-orb:hover { background: #bb86fc; }

.category-btn { padding: 0.5rem 1rem; border: 1px solid #444; border-radius: 0.5rem; background: #222; color: #fff; cursor: pointer; }
.category-btn.active { background: #bb86fc; border-color: #bb86fc; }

.episode-card { background: #222; padding: 1rem; border: 1px solid #444; border-radius: 0.5rem; cursor: pointer; }
.episode-card:hover { background: #333; border-color: #bb86fc; }

.podcast-card { background: #222; padding: 1rem; border: 1px solid #444; border-radius: 0.5rem; min-width: 250px; }
.podcast-card:hover { background: #333; border-color: #bb86fc; }

.btn { padding: 0.5rem 1rem; background: #bb86fc; color: #fff; border-radius: 0.5rem; cursor: pointer; }
</style>

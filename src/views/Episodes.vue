<!-- src/views/Episodes.vue -->
<template>
  <div class="episodes bg-black text-white min-h-screen flex p-6">
    <!-- Navigation Orbs (Left Side) -->
    <nav class="nav-orb-container left">
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.path"
        class="nav-orb"
      >
        {{ link.name }}
      </router-link>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <div class="tablet-container">
        <!-- Tablet "Screen" -->
        <div class="tablet-screen">
          <div v-if="activeContent" class="video-player">
            <h3 class="text-xl font-semibold mb-2 text-center">{{ activeContent.title }}</h3>
            <iframe
              ref="videoPlayer"
              class="w-full h-full rounded"
              :src="activeContent.videoUrl"
              frameborder="0"
              allowfullscreen
              allow="autoplay; encrypted-media"
            ></iframe>
            <button class="detach-btn" @click="detachContent">
              Detach
            </button>
          </div>
          <div v-else class="placeholder">
            <p class="text-gray-400">Select an episode or podcast to begin</p>
          </div>
        </div>

        <!-- Category Selection -->
        <div class="category-section">
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
        <div class="episode-list">
          <div
            v-for="episode in filteredEpisodes"
            :key="episode.id"
            @click="selectContent(episode)"
            class="episode-card"
            :class="{ active: activeContent?.id === episode.id && activeContent?.type === 'episode' }"
          >
            <div class="episode-info">
              <h3 class="text-lg font-semibold">{{ episode.title }}</h3>
              <p class="text-sm text-gray-400">{{ episode.description }}</p>
            </div>
            <div v-if="activeContent?.id === episode.id && activeContent?.type === 'episode'" class="playing-indicator">
              ▶ Playing
            </div>
          </div>
        </div>
      </div>

      <!-- Podcast Episodes -->
      <section class="latest-episodes mt-12 w-full">
        <h2 class="text-2xl font-bold mb-6 text-center">Podcast Episodes</h2>
        <div class="episode-grid">
          <div
            v-for="podcast in podcasts"
            :key="podcast.id"
            class="podcast-card"
          >
            <h3 class="text-lg font-semibold">{{ podcast.title }}</h3>
            <p class="text-sm text-gray-400">{{ podcast.description }}</p>
            <button @click="selectContent(podcast)" class="btn">Watch Now</button>
          </div>
        </div>
      </section>
    </div>

    <!-- Podcast Orbs (Right Side) -->
    <nav class="nav-orb-container right">
      <button
        v-for="podcast in podcasts"
        :key="podcast.id"
        @click="selectContent(podcast)"
        class="nav-orb"
        :class="{ active: activeContent?.id === podcast.id && activeContent?.type === 'podcast' }"
      >
        {{ podcast.title }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Episode {
  id: number
  type: 'episode'
  title: string
  description: string
  videoUrl: string
  categories: string[]
}

interface Podcast {
  id: number
  type: 'podcast'
  title: string
  description: string
  videoUrl: string
}

// Navigation links (left orbs)
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Episodes', path: '/episodes' },
  { name: 'Music', path: '/music' },
  { name: 'Games', path: '/games' },
]

// Categories
const categories = ['All', 'Political', 'Blockchain', 'Investing', 'Entertainment']
const selectedCategory = ref('All')

// Episodes (tablet player)
const episodes = ref<Episode[]>([
  {
    id: 1,
    type: 'episode',
    title: 'No Souls At The Poles',
    description: 'Exploring the mysteries beyond the ice.',
    videoUrl: 'https://www.youtube.com/embed/UkcP_TM9ytE',
    categories: ['Political', 'Entertainment'],
  },
  {
    id: 2,
    type: 'episode',
    title: 'We Gone Ball',
    description: 'A high-energy dive into the grind.',
    videoUrl: 'https://www.youtube.com/embed/oLSvwaDd3H8',
    categories: ['Entertainment'],
  },
  {
    id: 3,
    type: 'episode',
    title: 'Freestyle Freddy',
    description: 'Raw rhymes and real talk.',
    videoUrl: 'https://www.youtube.com/embed/jp1vwODYfHI',
    categories: ['Entertainment'],
  },
  {
    id: 4,
    type: 'episode',
    title: 'Really Wanna See',
    description: 'Chasing visions and breaking limits.',
    videoUrl: 'https://www.youtube.com/embed/bQ3I-84S90M',
    categories: ['Investing', 'Entertainment'],
  },
])



// Video player state
const activeContent = ref<Episode | Podcast | null>(null)
const videoPlayer = ref<HTMLIFrameElement | null>(null)

const selectContent = (content: Episode | Podcast) => {
  activeContent.value = content
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
}

// Filter episodes by category
const filteredEpisodes = computed(() => {
  if (selectedCategory.value === 'All') return episodes.value
  return episodes.value.filter(episode =>
    episode.categories.includes(selectedCategory.value)
  )
})

watch(activeContent, (newContent) => {
  if (newContent && videoPlayer.value) {
    // Append autoplay query so video begins playing immediately
    videoPlayer.value.src = newContent.videoUrl + '?autoplay=1'
  }
})

/**
 * Detach the current activeContent into a new pop-up window.
 * (Picture-in-Picture is not supported for iframes/videos from other domains.)
 */
function detachContent() {
  if (!activeContent.value) return
  // Open videoUrl in a new window
  window.open(activeContent.value.videoUrl, '_blank', 'width=800,height=450')
}
</script>

<style scoped>
/* Main container: Flex layout for orbs and content */
.episodes {
  background: linear-gradient(to bottom, #000, #0a0a0a);
  font-family: 'Inter', sans-serif;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

/* Navigation Orbs: Vertical on left and right */
.nav-orb-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: fixed;
  top: 2rem;
  z-index: 10;
}
.nav-orb-container.left {
  left: 1rem;
}
.nav-orb-container.right {
  right: 1rem;
}
.nav-orb {
  display: flex;
  width: 60px;
  height: 60px;
  background-color: #bb86fc;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #fff;
  font-size: 0.9em;
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
}
.nav-orb:hover {
  transform: scale(1.2);
  background-color: #6200ea;
}
.nav-orb.active {
  background-color: #6200ea;
  box-shadow: 0 0 10px rgba(187, 134, 252, 0.5);
}

/* Main content: Centered tablet and podcasts */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding-left: 5rem;
  padding-right: 5rem;
  max-width: 900px;
}

/* Tablet container: Centered with max-width */
.tablet-container {
  width: 100%;
  max-width: 800px;
  background: #1a1a1a;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(187, 134, 252, 0.3);
  border: 4px solid #333;
}

/* Tablet screen: Video player area */
.tablet-screen {
  background: #000;
  border-radius: 0.5rem;
  padding: 0;
  aspect-ratio: 16/9;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.video-player iframe {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  background: #000;
  margin-bottom: 0.5rem;
}

/* Detach button */
.detach-btn {
  background-color: #00ffff;
  color: #0d0d0d;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}
.detach-btn:hover {
  background-color: #00d4d4;
}

/* Placeholder */
.placeholder {
  text-align: center;
  font-size: 1.2rem;
  color: #888888;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Category section */
.category-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.category-btn {
  padding: 0.5rem 1rem;
  background: #222;
  border: 1px solid #444;
  border-radius: 0.5rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}
.category-btn:hover {
  background: #333;
  border-color: #bb86fc;
}
.category-btn.active {
  background: #bb86fc;
  border-color: #bb86fc;
  color: #fff;
}

/* Episode list: Scalable vertical stack */
.episode-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #bb86fc #222;
}
.episode-list::-webkit-scrollbar {
  width: 8px;
}
.episode-list::-webkit-scrollbar-track {
  background: #222;
}
.episode-list::-webkit-scrollbar-thumb {
  background: #bb86fc;
  border-radius: 4px;
}

.episode-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  background: #222;
  cursor: pointer;
  transition: all 0.3s ease;
}
.episode-card:hover {
  background: #333;
  border-color: #bb86fc;
}
.episode-card.active {
  border-color: #bb86fc;
  box-shadow: 0 0 10px rgba(187, 134, 252, 0.5);
}
.episode-info {
  flex: 1;
}
.episode-info h3 {
  color: #fff;
}
.episode-info p {
  color: #888888;
}
.playing-indicator {
  color: #bb86fc;
  font-weight: bold;
}

/* Podcast section */
.latest-episodes {
  width: 100%;
  margin-top: 3rem;
}
.latest-episodes h2 {
  color: #fff;
  margin-bottom: 1rem;
  text-align: center;
}
.episode-grid {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #bb86fc #222;
}
.episode-grid::-webkit-scrollbar {
  height: 8px;
}
.episode-grid::-webkit-scrollbar-track {
  background: #222;
}
.episode-grid::-webkit-scrollbar-thumb {
  background: #bb86fc;
  border-radius: 4px;
}
.podcast-card {
  background: #222;
  padding: 1rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  min-width: 250px;
  flex-shrink: 0;
}
.podcast-card:hover {
  background: #333;
  border-color: #bb86fc;
}
.podcast-card h3 {
  color: #bb86fc;
}
.podcast-card p {
  color: #888888;
}
.btn {
  display: inline-block;
  padding: 10px 20px;
  background: #bb86fc;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 0.5rem;
}
.btn:hover {
  background: #6200ea;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .episodes {
    flex-direction: column;
  }
  .nav-orb-container {
    position: static;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .nav-orb-container.right {
    margin-top: 1rem;
  }
  .main-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .tablet-container {
    max-width: 100%;
    padding: 1rem;
  }
  .episode-card {
    padding: 0.75rem;
  }
  .category-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
  .latest-episodes {
    width: 100%;
  }
  .podcast-card {
    min-width: 200px;
  }
  h3 {
    font-size: 1rem;
  }
  p {
    font-size: 0.8rem;
  }
}
@media (max-width: 480px) {
  .episode-card {
    padding: 0.5rem;
  }
  .category-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
  .podcast-card {
    min-width: 180px;
  }
}
</style>

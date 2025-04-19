<!-- Episodes.vue -->
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
import { ref, watch, computed } from 'vue';

interface Episode {
  id: number;
  type: 'episode';
  title: string;
  description: string;
  videoUrl: string;
  categories: string[];
}

interface Podcast {
  id: number;
  type: 'podcast';
  title: string;
  description: string;
  videoUrl: string;
}

// Navigation links (left orbs)
const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Episodes', path: '/episodes' },
  { name: 'Music', path: '/music' },
  { name: 'Games', path: '/games' },
];

// Categories
const categories = ['All', 'Political', 'Blockchain', 'Investing', 'Entertainment'];
const selectedCategory = ref('All');

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
]);

// Podcast episodes (right orbs and grid) **********
const podcasts = ref<Podcast[]>([
  {
    id: 1,
    type: 'podcast',
    title: 'Episode 1',
    description: 'Discussion on current events.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Debug: Replace with actual podcast video URL
  },
  {
    id: 2,
    type: 'podcast',
    title: 'Episode 2',
    description: 'Deep dive into finance.',
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0', // Debug: Replace with actual podcast video URL
  },
  {
    id: 3,
    type: 'podcast',
    title: 'Episode 3',
    description: 'Debate on technology trends.',
    videoUrl: 'https://www.youtube.com/embed/kXYiU_JCYtU', // Debug: Replace with actual podcast video URL
  },
]);

// Video player state
const activeContent = ref<Episode | Podcast | null>(null);
const videoPlayer = ref<HTMLIFrameElement | null>(null);

const selectContent = (content: Episode | Podcast) => {
  activeContent.value = content;
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

// Filter episodes by category
const filteredEpisodes = computed(() => {
  if (selectedCategory.value === 'All') return episodes.value;
  return episodes.value.filter(episode =>
    episode.categories.includes(selectedCategory.value)
  );
});

watch(activeContent, (newContent) => {
  if (newContent && videoPlayer.value) {
    videoPlayer.value.src = newContent.videoUrl + '?autoplay=1';
    // Debug: Check console for iframe loading issues if video doesn't play
  }
});
</script>

<style scoped>
/* Main container: Flex layout for orbs and content */
.episodes {
  background: linear-gradient(to bottom, #000, #0a0a0a);
  /* Debug: Adjust gradient colors (e.g., #000 to #111) for background */
  font-family: 'Inter', sans-serif;
  /* Debug: Change font-family for different typography */
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  /* Debug: Adjust justify-content (e.g., flex-start) to shift content */
}

/* Navigation Orbs: Vertical on left and right */
.nav-orb-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  /* Debug: Adjust gap (e.g., 1rem for tighter, 2rem for wider orb spacing) */
  position: fixed;
  top: 2rem;
  /* Debug: Adjust top (e.g., 1rem, 3rem) to move orbs vertically */
  z-index: 10;
  /* Debug: Increase z-index (e.g., 20) if orbs are hidden behind content */
}
.nav-orb-container.left {
  left: 1rem;
  /* Debug: Adjust left (e.g., 0.5rem, 2rem) to shift left orbs */
}
.nav-orb-container.right {
  right: 1rem;
  /* Debug: Adjust right (e.g., 0.5rem, 2rem) to shift right orbs */
}
.nav-orb {
  display: flex;
  width: 60px;
  height: 60px;
  background-color: #bb86fc;
  /* Debug: Change #bb86fc for orb background color */
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #fff;
  /* Debug: Change #fff for orb text color */
  font-size: 0.9em;
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
}
.nav-orb:hover {
  transform: scale(1.2);
  background-color: #6200ea;
  /* Debug: Change #6200ea for orb hover background */
}
.nav-orb.active {
  background-color: #6200ea;
  /* Debug: Change #6200ea for active orb background */
  box-shadow: 0 0 10px rgba(187, 134, 252, 0.5);
  /* Debug: Adjust rgba(187, 134, 252, 0.5) for active orb glow */
}

/* Main content: Centered tablet and podcasts */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  /* Debug: Changed to margin: 0 auto for centering; adjust if needed */
  padding-left: 5rem;
  padding-right: 5rem;
  /* Debug: Adjust padding-left/right (e.g., 4rem, 6rem) to clear orbs */
  max-width: 900px;
  /* Debug: Adjust max-width (e.g., 800px, 1000px) for content width */
}

/* Tablet container: Centered with max-width */
.tablet-container {
  width: 100%;
  max-width: 800px;
  /* Debug: Adjust max-width (e.g., 700px, 900px) for tablet size */
  background: #1a1a1a;
  /* Debug: Change #1a1a1a for tablet background */
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(187, 134, 252, 0.3);
  /* Debug: Adjust rgba(187, 134, 252, 0.3) for shadow glow */
  border: 4px solid #333;
  /* Debug: Change #333 for tablet border */
}

/* Tablet screen: Video player area */
.tablet-screen {
  background: #000;
  /* Debug: Change #000 for screen background */
  border-radius: 0.5rem;
  padding: 0;
  /* Debug: Add padding (e.g., 0.5rem) if video needs spacing */
  aspect-ratio: 16/9;
  /* Debug: Adjust aspect-ratio (e.g., 4/3) for different video formats */
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
  /* Debug: Adjust width/height (e.g., 90%) if iframe needs borders */
}

/* Placeholder */
.placeholder {
  text-align: center;
  font-size: 1.2rem;
  color: #888888;
  /* Debug: Change #gray-400 for placeholder text color */
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
  /* Debug: Adjust margin-bottom (e.g., 1rem, 2rem) for spacing */
}
.category-btn {
  padding: 0.5rem 1rem;
  background: #222;
  /* Debug: Change #222 for button background */
  border: 1px solid #444;
  /* Debug: Change #444 for button border */
  border-radius: 0.5rem;
  color: #fff;
  /* Debug: Change #fff for button text */
  cursor: pointer;
  transition: all 0.3s ease;
}
.category-btn:hover {
  background: #333;
  /* Debug: Change #333 for button hover background */
  border-color: #bb86fc;
  /* Debug: Change #bb86fc for button hover border */
}
.category-btn.active {
  background: #bb86fc;
  /* Debug: Change #bb86fc for active button background */
  border-color: #bb86fc;
  color: #fff;
  /* Debug: Change #fff for active button text */
}

/* Episode list: Scalable vertical stack */
.episode-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  /* Debug: Adjust max-height (e.g., 200px, 400px) for visible cards */
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #bb86fc #222;
  /* Debug: Change #bb86fc for scrollbar thumb, #222 for track */
}
.episode-list::-webkit-scrollbar {
  width: 8px;
  /* Debug: Adjust width (e.g., 6px, 10px) for scrollbar size */
}
.episode-list::-webkit-scrollbar-track {
  background: #222;
  /* Debug: Change #222 for scrollbar track */
}
.episode-list::-webkit-scrollbar-thumb {
  background: #bb86fc;
  /* Debug: Change #bb86fc for scrollbar thumb */
  border-radius: 4px;
}

.episode-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #444;
  /* Debug: Change #444 for card border */
  border-radius: 0.5rem;
  background: #222;
  /* Debug: Change #222 for card background */
  cursor: pointer;
  transition: all 0.3s ease;
}
.episode-card:hover {
  background: #333;
  /* Debug: Change #333 for card hover background */
  border-color: #bb86fc;
  /* Debug: Change #bb86fc for card hover border */
}
.episode-card.active {
  border-color: #bb86fc;
  /* Debug: Change #bb86fc for active card border */
  box-shadow: 0 0 10px rgba(187, 134, 252, 0.5);
  /* Debug: Adjust rgba(187, 134, 252, 0.5) for active card glow */
}
.episode-info {
  flex: 1;
}
.episode-info h3 {
  color: #fff;
  /* Debug: Change #fff for card title */
}
.episode-info p {
  color: #888888; /* Replace with a valid color code */
  /* Debug: Change #gray-400 for card description */
}
.playing-indicator {
  color: #bb86fc;
  /* Debug: Change #bb86fc for playing indicator */
  font-weight: bold;
}

/* Podcast section */
.latest-episodes {
  width: 100%;
  /* Debug: Set to 100% for full screen width; adjust to 90% if edges need spacing */
  margin-top: 3rem;
  /* Debug: Adjust margin-top (e.g., 2rem, 4rem) for spacing from tablet */
}
.latest-episodes h2 {
  color: #fff;
  /* Debug: Change #fff for podcast header color */
}
.episode-grid {
  display: flex;
  flex-direction: row;
  /* Debug: Changed to row for horizontal layout; revert to grid for original */
  overflow-x: auto;
  /* Debug: Enables horizontal scrolling; remove for no scroll */
  gap: 1rem;
  /* Debug: Adjust gap (e.g., 0.5rem, 1.5rem) for card spacing */
  padding-bottom: 0.5rem;
  /* Debug: Adjust padding-bottom (e.g., 0rem, 1rem) for scrollbar spacing */
  scrollbar-width: thin;
  scrollbar-color: #bb86fc #222;
  /* Debug: Change #bb86fc for scrollbar thumb, #222 for track */
}
.episode-grid::-webkit-scrollbar {
  height: 8px;
  /* Debug: Adjust height (e.g., 6px, 10px) for scrollbar size */
}
.episode-grid::-webkit-scrollbar-track {
  background: #222;
  /* Debug: Change #222 for scrollbar track */
}
.episode-grid::-webkit-scrollbar-thumb {
  background: #bb86fc;
  /* Debug: Change #bb86fc for scrollbar thumb */
  border-radius: 4px;
}
.podcast-card {
  background: #222;
  /* Debug: Change #222 for podcast card background */
  padding: 1rem;
  border: 1px solid #444;
  /* Debug: Change #444 for podcast card border */
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  min-width: 250px;
  /* Debug: Adjust min-width (e.g., 200px, 300px) for card size */
  flex-shrink: 0;
  /* Debug: Prevents cards from shrinking; remove if cards should resize */
}
.podcast-card:hover {
  background: #333;
  /* Debug: Change #333 for podcast card hover */
  border-color: #bb86fc;
  /* Debug: Change #bb86fc for podcast card hover border */
}
.podcast-card h3 {
  color: #bb86fc;
  /* Debug: Change #bb86fc for podcast card title */
}
.podcast-card p {
  color: #888888;
  /* Debug: Change #gray-400 for podcast card description */
}
.btn {
  display: inline-block;
  padding: 10px 20px;
  background: #bb86fc;
  /* Debug: Change #bb86fc for button background */
  color: #fff;
  /* Debug: Change #fff for button text */
  text-decoration: none;
  border-radius: 5px;
}
.btn:hover {
  background: #6200ea;
  /* Debug: Change #6200ea for button hover */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .episodes {
    flex-direction: column;
    /* Debug: Change to row if you want side-by-side on smaller screens */
  }
  .nav-orb-container {
    position: static;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    /* Debug: Adjust gap (e.g., 0.5rem, 1.5rem) for mobile orb spacing */
    margin-bottom: 1.5rem;
    /* Debug: Adjust margin-bottom (e.g., 1rem, 2rem) for spacing */
  }
  .nav-orb-container.right {
    margin-top: 1rem;
    /* Debug: Adjust margin-top (e.g., 0.5rem, 1.5rem) for right orbs */
  }
  .main-content {
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
    /* Debug: Adjust padding (e.g., 0.5rem, 2rem) for mobile centering */
  }
  .tablet-container {
    max-width: 100%;
    padding: 1rem;
    /* Debug: Adjust padding (e.g., 0.5rem, 1.5rem) for tablet */
  }
  
  .episode-card {
    padding: 0.75rem;
    /* Debug: Adjust padding (e.g., 0.5rem, 1rem) for cards */
  }
  .category-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    /* Debug: Adjust padding/font-size for smaller buttons */
  }
  .latest-episodes {
    width: 100%;
    /* Debug: Keep 100% for full width; adjust to 90% if needed */
  }
  .podcast-card {
    min-width: 200px;
    /* Debug: Adjust min-width (e.g., 150px, 250px) for smaller screens */
  }
  h3 {
    font-size: 1rem;
    /* Debug: Adjust font-size (e.g., 0.9rem, 1.2rem) for headers */
  }
  p {
    font-size: 0.8rem;
    /* Debug: Adjust font-size (e.g., 0.7rem, 0.9rem) for text */
  }
}
@media (max-width: 480px) {
  .episode-card {
    padding: 0.5rem;
    /* Debug: Adjust padding (e.g., 0.3rem, 0.7rem) for smaller cards */
  }
  .category-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    /* Debug: Adjust padding/font-size for tiny buttons */
  }
  .podcast-card {
    min-width: 180px;
    /* Debug: Adjust min-width (e.g., 150px, 200px) for tiny screens */
  }
}
</style>
<!-- Music.vue -->
<template>
  <div class="music bg-black text-white min-h-screen flex p-6">
    <!-- Particles.js Background -->
    <div id="particles-js" class="particles"></div>

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
        <!-- WaveSurfer Player -->
        <div class="music-player">
          <div id="waveform" ref="waveform"></div>
          <div class="timebar">
            <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>
          <div class="now-playing">{{ activeTrack ? `Now Playing: ${activeTrack.title}` : 'Select a track to play' }}</div>
          <div class="player-controls">
            <button @click="prevTrack">Prev</button>
            <button @click="playPause">{{ isPlaying ? 'Pause' : 'Play' }}</button>
            <button @click="nextTrack">Next</button>
          </div>
          <!-- Track List -->
          <ul class="track-list">
            <li
              v-for="track in tracks"
              :key="track.id"
              @click="selectTrack(track)"
              :class="{ active: activeTrack?.id === track.id }"
            >
              {{ track.title }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Visual Elements -->
      <div class="elements-container">
        <div class="sun-group-container">
          <img src="/images/sun-group.svg" alt="Sun Group" class="sun-group" />
        </div>
        <img src="/images/planetary.png" alt="Planet" class="planetary" />
        <img src="/images/remote-player.svg" alt="Remote Control" class="remote-player" />
      </div>
    </div>

    <!-- Track Orbs (Right Side) -->
    <nav class="nav-orb-container right">
      <button
        v-for="track in tracks"
        :key="track.id"
        @click="selectTrack(track)"
        class="nav-orb"
        :class="{ active: activeTrack?.id === track.id }"
      >
        {{ track.title.split(' ').slice(0, 2).join(' ') }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import WaveSurfer from 'wavesurfer.js';

interface Track {
  id: number;
  title: string;
  src: string;
}

// Navigation links (left orbs)
const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Episodes', path: '/episodes' },
  { name: 'Music', path: '/music' },
  { name: 'Games', path: '/games' },
];

// Tracks (right orbs and list)
const tracks = ref<Track[]>([
  { id: 1, title: 'Kick Back and Chill', src: '/audio/Kick-Back-and-Chill.mp3' },
  { id: 2, title: 'We Gone Ball', src: '/audio/We-Gone-Ball.mp3' },
  { id: 3, title: 'Really Wanna See', src: '/audio/Really-Wanna-See.mp3' },
  { id: 4, title: 'Why Not', src: '/audio/Why-Not.mp3' },
  { id: 5, title: 'On Me', src: '/audio/murder1.mp3' },
]);

// Player state
const waveform = ref<HTMLElement | null>(null);
const activeTrack = ref<Track | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
let wavesurfer: WaveSurfer | null = null;

const initWaveSurfer = () => {
  if (waveform.value) {
    wavesurfer = WaveSurfer.create({
      container: waveform.value,
      waveColor: '#bb86fc', // Debug: Change wave color (was #87CEEB)
      progressColor: '#6200ea', // Debug: Change progress color (was #FFD700)
      // backgroundColor: '#1a1a1a', // Debug: Removed invalid property
      cursorColor: '#6200ea', // Debug: Change cursor color (was #FFD700)
      height: 100, // Debug: Adjust height (was 150)
      barWidth: 2,
      barGap: 2,
      barRadius: 3,
      // Debug: No 'responsive' as it's default; add 'responsive: true as any' if needed
    });

    wavesurfer.on('ready', () => {
      duration.value = wavesurfer?.getDuration() || 0;
      if (activeTrack.value) {
        wavesurfer?.play();
        isPlaying.value = true;
      }
    });

    wavesurfer.on('audioprocess', () => {
      currentTime.value = wavesurfer?.getCurrentTime() || 0;
    });

    wavesurfer.on('finish', () => {
      isPlaying.value = false;
      nextTrack();
    });

    wavesurfer.on('error', (err) => {
      console.error('WaveSurfer error:', err); // Debug: Check audio loading issues
    });
  }
};

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const selectTrack = (track: Track) => {
  if (activeTrack.value?.id !== track.id) {
    activeTrack.value = track;
    if (wavesurfer) {
      wavesurfer.load(track.src);
    }
  } else {
    playPause();
  }
};

const playPause = () => {
  if (wavesurfer) {
    if (isPlaying.value) {
      wavesurfer.pause();
      isPlaying.value = false;
    } else if (activeTrack.value) {
      wavesurfer.play();
      isPlaying.value = true;
    }
  }
};

const prevTrack = () => {
  if (!activeTrack.value) return;
  const currentIndex = tracks.value.findIndex(t => t.id === activeTrack.value!.id);
  const prevIndex = (currentIndex - 1 + tracks.value.length) % tracks.value.length;
  selectTrack(tracks.value[prevIndex]);
};

const nextTrack = () => {
  if (!activeTrack.value) return;
  const currentIndex = tracks.value.findIndex(t => t.id === activeTrack.value!.id);
  const nextIndex = (currentIndex + 1) % tracks.value.length;
  selectTrack(tracks.value[nextIndex]);
};

// Particles.js initialization
const initParticles = () => {
  (window as any).particlesJS('particles-js', {
    particles: {
      number: { value: 100, density: { enable: true, value_area: 800 } }, // Debug: Increased for starry effect
      color: { value: '#bb86fc' }, // Debug: Purple stars
      shape: { type: 'circle' }, // Debug: Circle for star-like dots
      opacity: { value: 0.8, random: true }, // Debug: Slightly brighter
      size: { value: 2, random: true }, // Debug: Smaller for stars
      line_linked: { enable: false }, // Debug: No lines for starry look
      move: { enable: true, speed: 1, direction: 'none', random: true, straight: false, out_mode: 'out' },
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: false }, onclick: { enable: false }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    retina_detect: true,
  });
};

onMounted(() => {
  initWaveSurfer();
  initParticles();
  // Debug: Load first track on mount; comment out if not desired
  if (tracks.value.length > 0) {
    selectTrack(tracks.value[0]);
  }
});

onUnmounted(() => {
  if (wavesurfer) {
    wavesurfer.destroy();
  }
});
</script>

<style scoped>
/* Main container: Flex layout for orbs and content */
.music {
  background: #000;
  /* Debug: Adjust background (e.g., #111) for contrast */
  font-family: 'Inter', sans-serif;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  /* Debug: Ensure position: relative for z-index */
}

/* Particles.js background */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  /* Debug: Adjust z-index (e.g., 0) if particles obscure content */
}

/* Navigation Orbs: Vertical on left and right */
.nav-orb-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  /* Debug: Adjust gap (e.g., 1rem, 2rem) for orb spacing */
  position: fixed;
  top: 2rem;
  /* Debug: Adjust top (e.g., 1rem, 3rem) for position */
  z-index: 10;
  /* Debug: Increase z-index (e.g., 20) if orbs hidden */
}
.nav-orb-container.left {
  left: 1rem;
  /* Debug: Adjust left (e.g., 0.5rem, 2rem) */
}
.nav-orb-container.right {
  right: 1rem;
  /* Debug: Adjust right (e.g., 0.5rem, 2rem) */
}
.nav-orb {
  display: flex;
  width: 60px;
  height: 60px;
  background-color: #bb86fc;
  /* Debug: Change #bb86fc for orb background */
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #fff;
  /* Debug: Change #fff for orb text */
  font-size: 0.75em;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
}
.nav-orb:hover {
  transform: scale(1.2);
  background-color: #6200ea;
  /* Debug: Change #6200ea for hover */
}
.nav-orb.active {
  background-color: #6200ea;
  /* Debug: Change #6200ea for active */
  box-shadow: 0 0 10px rgba(187, 134, 252, 0.5);
  /* Debug: Adjust rgba(187, 134, 252, 0.5) for glow */
}

/* Main content: Centered player */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding-left: 5rem;
  padding-right: 5rem;
  /* Debug: Adjust padding (e.g., 4rem, 6rem) to clear orbs */
  max-width: 900px;
  /* Debug: Adjust max-width (e.g., 800px, 1000px) */
}

/* Tablet container */
.tablet-container {
  width: 100%;
  max-width: 800px;
  /* Debug: Adjust max-width (e.g., 700px, 900px) */
  background: #1a1a1a;
  /* Debug: Change #1a1a1a for tablet background */
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(187, 134, 252, 0.3);
  /* Debug: Adjust rgba(187, 134, 252, 0.3) for shadow */
  border: 4px solid #333;
  /* Debug: Change #333 for border */
}

/* Music player */
.music-player {
  width: 100%;
}
#waveform {
  width: 100%;
  background: rgba(187, 134, 252, 0.1);
  /* Debug: Change rgba(187, 134, 252, 0.1) for waveform background */
}
.timebar {
  margin: 0.5rem 0;
  text-align: center;
  color: #bb86fc;
  /* Debug: Change #bb86fc for time text */
  font-size: 0.9rem;
}
.now-playing {
  font-size: 1rem;
  color: #bb86fc;
  /* Debug: Change #bb86fc for text */
  margin: 1rem 0;
  text-align: center;
}
.player-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  /* Debug: Adjust gap (e.g., 0.5rem, 1.5rem) */
  margin: 1rem 0;
}
.player-controls button {
  padding: 0.5rem 1rem;
  background: #bb86fc;
  /* Debug: Change #bb86fc for button */
  border: none;
  border-radius: 20px;
  color: #121212;
  /* Debug: Change #121212 for button text */
  cursor: pointer;
  transition: transform 0.3s;
}
.player-controls button:hover {
  transform: scale(1.05);
  /* Debug: Adjust scale (e.g., 1.1) */
}

/* Track list */
.track-list {
  list-style: none;
  margin: 1rem 0;
  max-height: 200px;
  /* Debug: Adjust max-height (e.g., 150px, 250px) */
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #bb86fc #222;
  /* Debug: Change #bb86fc for thumb, #222 for track */
}
.track-list::-webkit-scrollbar {
  width: 8px;
  /* Debug: Adjust width (e.g., 6px, 10px) */
}
.track-list::-webkit-scrollbar-track {
  background: #222;
  /* Debug: Change #222 for track */
}
.track-list::-webkit-scrollbar-thumb {
  background: #bb86fc;
  /* Debug: Change #bb86fc for thumb */
  border-radius: 4px;
}
.track-list li {
  height: 40px;
  line-height: 40px;
  padding: 0 0.5rem;
  color: #fff;
  /* Debug: Change #fff for text */
  cursor: pointer;
  transition: background 0.3s;
}
.track-list li:hover {
  background: rgba(187, 134, 252, 0.2);
  /* Debug: Change rgba(187, 134, 252, 0.2) for hover */
}
.track-list li.active {
  background: rgba(187, 134, 252, 0.3);
  /* Debug: Change rgba(187, 134, 252, 0.3) for active */
  color: #bb86fc;
  /* Debug: Change #bb86fc for active text */
}

/* Visual elements */
.elements-container {
  margin-top: 2rem;
  /* Debug: Adjust margin-top (e.g., 1rem, 3rem) */
  text-align: center;
}
.sun-group-container {
  position: relative;
}
.sun-group {
  width: 320px;
  /* Debug: Adjust width (e.g., 280px, 360px) */
  height: auto;
  display: block;
  margin: 1rem auto;
}
.planetary {
  width: 300px;
  /* Debug: Adjust width (e.g., 260px, 340px) */
  height: auto;
  display: block;
  margin: 1rem auto;
}
.remote-player {
  width: 180px;
  /* Debug: Adjust width (e.g., 160px, 200px) */
  height: auto;
  display: block;
  margin: 1rem auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .music {
    flex-direction: column;
    /* Debug: Change to row if needed */
  }
  .nav-orb-container {
    position: static;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    /* Debug: Adjust gap (e.g., 0.5rem, 1.5rem) */
    margin-bottom: 1.5rem;
  }
  .nav-orb-container.right {
    margin-top: 1rem;
    /* Debug: Adjust margin-top (e.g., 0.5rem, 1.5rem) */
  }
  .main-content {
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
    /* Debug: Adjust padding (e.g., 0.5rem, 2rem) */
  }
  .tablet-container {
    max-width: 100%;
    padding: 1rem;
    /* Debug: Adjust padding (e.g., 0.5rem, 1.5rem) */
  }
  #waveform {
    height: 80px;
    /* Debug: Adjust height (e.g., 60px, 100px) */
  }
  .timebar {
    font-size: 0.8rem;
    /* Debug: Adjust font-size (e.g., 0.7rem, 0.9rem) */
  }
  .now-playing {
    font-size: 0.9rem;
    /* Debug: Adjust font-size (e.g., 0.8rem, 1rem) */
  }
  .player-controls button {
    padding: 0.4rem 0.8rem;
    /* Debug: Adjust padding */
  }
  .track-list li {
    font-size: 0.9rem;
    /* Debug: Adjust font-size (e.g., 0.8rem, 1rem) */
  }
  .sun-group {
    width: 280px;
    /* Debug: Adjust width (e.g., 240px, 320px) */
  }
  .planetary {
    width: 260px;
    /* Debug: Adjust width (e.g., 220px, 300px) */
  }
  .remote-player {
    width: 160px;
    /* Debug: Adjust width (e.g., 140px, 180px) */
  }
}
@media (max-width: 480px) {
  .nav-orb {
    width: 50px;
    height: 50px;
    font-size: 0.7em;
    /* Debug: Adjust size/font */
  }
  .track-list li {
    font-size: 0.8rem;
    height: 36px;
    line-height: 36px;
    /* Debug: Adjust for smaller tracks */
  }
  .sun-group {
    width: 240px;
    /* Debug: Adjust width (e.g., 200px, 280px) */
  }
  .planetary {
    width: 220px;
    /* Debug: Adjust width (e.g., 180px, 260px) */
  }
  .remote-player {
    width: 140px;
    /* Debug: Adjust width (e.g., 120px, 160px) */
  }
}
</style>
<template>
  <div class="music-player bg-black text-white min-h-screen flex flex-col items-center justify-center p-6">
    <h2 class="text-3xl font-bold mb-6">Karma Soundwaves</h2>

    <div class="w-full max-w-4xl space-y-6">
      <div
        v-for="track in tracks"
        :key="track.id"
        @click="selectTrack(track)"
        class="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition cursor-pointer"
      >
        <div>
          <h3 class="text-xl font-semibold">{{ track.title }}</h3>
          <p class="text-sm text-gray-400">{{ track.artist }}</p>
        </div>
        <div v-if="activeTrack?.id === track.id" class="text-green-400 font-bold">▶ Playing</div>
      </div>

      <!-- Audio Player + Waveform -->
      <div v-if="activeTrack" class="mt-8 w-full">
        <h3 class="text-xl font-semibold mb-2 text-center">Now Playing: {{ activeTrack.title }}</h3>
        <div id="waveform" class="w-full bg-gray-900 rounded mb-4"></div>

        <div class="flex justify-center space-x-4">
          <button @click="playPause" class="px-4 py-2 bg-white text-black rounded font-semibold">
            {{ isPlaying ? 'Pause' : 'Play' }}
          </button>
          <button @click="stop" class="px-4 py-2 border rounded">Stop</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import WaveSurfer from 'wavesurfer.js';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const tracks = ref<Track[]>([
  {
    id: 1,
    title: 'Cosmic Echoes',
    artist: 'Nova x Loopera',
    url: '/audio/track1.mp3',
  },
  {
    id: 2,
    title: 'Quantum Drift',
    artist: 'The Voidtape',
    url: '/audio/track2.mp3',
  },
  {
    id: 3,
    title: 'Orbit Mode',
    artist: 'Karma Beatz',
    url: '/audio/track3.mp3',
  },
]);

const activeTrack = ref<Track | null>(null);
const isPlaying = ref(false);
let wave: WaveSurfer | null = null;

const selectTrack = (track: Track) => {
  activeTrack.value = track;
};

const initializeWaveSurfer = (track: Track) => {
  if (wave) {
    wave.destroy();
  }

  wave = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#888',
    progressColor: '#16f5b9',
    cursorColor: '#fff',
    barWidth: 2,
    height: 100,
    backend: 'MediaElement',
    mediaControls: true,
  });

  wave.load(track.url);

  wave.on('ready', () => {
    wave?.play();
    isPlaying.value = true;
  });

  wave.on('finish', () => {
    isPlaying.value = false;
  });

  // Manually trigger resize on initialization to ensure correct dimensions
  setTimeout(() => {
    wave?.drawBuffer();
  }, 0);
};

watch(activeTrack, (newTrack) => {
  if (newTrack) {
    initializeWaveSurfer(newTrack);
  }
});

const playPause = () => {
  if (wave) {
    wave.playPause();
    isPlaying.value = wave.isPlaying();
  }
};

const stop = () => {
  wave?.stop();
  isPlaying.value = false;
  activeTrack.value = null;
};

// Handle window resize manually to ensure responsiveness
const handleResize = () => {
  if (wave) {
    wavesurfer.empty()
wavesurfer.load'url;
;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (wave) {
    wave.destroy();
    wave = null;
  }
});
</script>

<style scoped>
.music-player {
  background: linear-gradient(to bottom, #000, #0a0a0a);
}

/* Ensure waveform container is fully responsive */
#waveform {
  width: 100%;
  min-height: 100px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .music-player {
    padding: 1rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  .text-xl {
    font-size: 1.25rem;
  }
  #waveform {
    min-height: 80px;
  }
}

@media (max-width: 480px) {
  .music-player {
    padding: 0.5rem;
  }
  h2 {
    font-size: 1.25rem;
  }
  .text-xl {
    font-size: 1rem;
  }
  #waveform {
    min-height: 60px;
  }
}
</style>
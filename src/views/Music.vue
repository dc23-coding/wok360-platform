<!-- src/views/Music.vue -->
<template>
  <div class="music-page bg-black text-white min-h-screen flex p-6">
    <!-- Particles.js Background -->
    <div id="particles-js" class="particles"></div>

    <!-- Navigation Orbs (Left Side) -->
    <nav class="nav-orb-container left">
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.path"
        class="nav-orb"
        active-class="active"
      >
        {{ link.name }}
      </router-link>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Playlist + Avatar Section -->
      <div class="playlist-machine">
        <!-- Avatar Orb -->
        <div class="orb avatar-orb" @click="triggerAvatar">
          <video
            ref="avatarVideo"
            class="avatar-video"
            src="/avatars/avatar-priestsw.mp4"
            autoplay
            loop
            muted
            playsinline
          ></video>
        </div>

        <!-- Current Playlist Box -->
        <div class="playlist-container section">
          <h2 class="section-title">Playlist</h2>
          <ul class="playlist-list">
            <li
              v-for="song in playlist"
              :key="song.id"
              class="playlist-item"
            >
              <span class="song-title">{{ song.title }}</span>
              <audio
                :src="song.src"
                controls
                class="song-audio"
                @play="onSongPlay"
              ></audio>
            </li>
          </ul>
        </div>
      </div>

      <!-- Beat Selection + Recording Section -->
      <div class="tablet-container">
        <!-- Beat Selection -->
        <div class="section">
          <h2 class="section-title">Select a Beat</h2>
          <select v-model="selectedBeatId" class="beat-select">
            <option disabled value="">-- Choose a Beat --</option>
            <option
              v-for="beat in beats"
              :key="beat.id"
              :value="beat.id"
            >
              {{ beat.title }}
            </option>
          </select>
          <div v-if="currentBeat" class="beat-controls">
            <audio
              ref="beatAudio"
              :src="currentBeat.src"
              preload="metadata"
              @play="onSongPlay"
            ></audio>
            <button @click="toggleBeatPlayback" class="control-button">
              {{ isBeatPlaying ? 'Pause Beat' : 'Play Beat' }}
            </button>
            <span class="beat-duration">
              {{ formatTime(beatCurrentTime) }} / {{ formatTime(beatDuration) }}
            </span>
          </div>
        </div>

        <!-- 🎵 Beat Controls -->
<div class="flex gap-2 items-center mt-4">
  <button @click="toggleBeatPlayback">
    {{ isBeatPlaying ? 'Pause' : 'Play' }} Beat
  </button>
  <button @click="restartBeat">Restart</button>
  <button @click="stopBeat">Stop</button>
</div>

        <!-- 🔊 Hidden audio element for beat -->
        <audio
          ref="beatAudio"
          @play="onBeatPlay"
          @pause="onBeatPauseOrEnd"
          @ended="onBeatPauseOrEnd"
          class="hidden"
        />

        <!-- 🎤 Recorded Audio Preview -->
        <div v-if="recordedAudioURL" class="mt-6">
          <p class="font-bold mb-1">Your Recording:</p>
          <audio :src="recordedAudioURL" controls class="w-full" />
        </div>


        <!-- Recording Controls -->
        <div class="section">
          <h2 class="section-title">Record Your Audio</h2>
          <div class="record-controls">
            <button
              @click="startRecording"
              :disabled="isRecording || !micSupported"
              class="control-button"
            >
              Start Recording
            </button>
            <button
              @click="stopRecording"
              :disabled="!isRecording"
              class="control-button"
            >
              Stop Recording
            </button>
          </div>
          <div v-if="!micSupported" class="error-text">
            Microphone access is not supported in this browser.
          </div>
          <div v-if="recordedAudioURL" class="recorded-playback">
            <h3 class="playback-title">Your Recording</h3>
            <audio
              :src="recordedAudioURL"
              controls
              class="playback-audio"
            ></audio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import { v4 as uuidv4 } from 'uuid'

// Explicitly type user to avoid 'never' type error
const user = ref<any>(null)
onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
})



// 1) Navigation links (left-side orbs)
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Episodes', path: '/episodes' },
  { name: 'Games', path: '/games' }
]

// 2) Playlist (existing tracks)
interface Song {
  id: number
  title: string
  src: string
}
const playlist = ref<Song[]>([
  { id: 1, title: 'Kick Back and Chill', src: '/audio/Kick-Back-and-Chill.mp3' },
  { id: 2, title: 'We Gone Ball',        src: '/audio/We-Gone-Ball.mp3' },
  { id: 3, title: 'Really Wanna See',    src: '/audio/Really-Wanna-See.mp3' },
  { id: 4, title: 'Why Not',             src: '/audio/Why-Not.mp3' },
  { id: 5, title: 'On Me',               src: '/audio/murder1.mp3' }
])


// 3) Beats for user to choose (placeholders)
interface Beat {
  id: number
  title: string
  src: string
}
const beats = ref<Beat[]>([
  { id: 1, title: 'Show Boat', src: '/audio/Show-Boat.mp3' },
  { id: 2, title: 'Tough', src: '/audio/Tough.mp3' },
  { id: 3, title: 'Murderous', src: '/audio/Murderous.mp3' }
])

// 4) Beat selection state
const selectedBeatId = ref<number | ''>('')
const currentBeat = computed(() => {
  return beats.value.find(b => b.id === selectedBeatId.value) || null
})

// 5) Beat playback refs/state
const beatAudio = ref<HTMLAudioElement | null>(null)
const isBeatPlaying = ref(false)
const beatDuration = ref(0)
const beatCurrentTime = ref(0)
let beatTimeUpdateInterval: number | null = null

const toggleBeatPlayback = async () => {
  if (!beatAudio.value || !currentBeat.value) return

  if (isBeatPlaying.value) {
    beatAudio.value.pause()
  } else {
    beatAudio.value.play()

    // ✅ Log play to Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      try {
        await supabase.from('music_history').insert({
          user_id: user.id,
          track_id: currentBeat.value.id.toString(),
          track_name: currentBeat.value.title,
          played_at: new Date()
        })
      } catch (err) {
        console.error('Error logging music history:', err)
      }
    }
  }
}



const onBeatPlay = () => {
  isBeatPlaying.value = true
  beatTimeUpdateInterval = window.setInterval(() => {
    if (beatAudio.value) {
      beatCurrentTime.value = beatAudio.value.currentTime
    }
  }, 200)
}

const onBeatPauseOrEnd = () => {
  isBeatPlaying.value = false
  if (beatTimeUpdateInterval !== null) {
    clearInterval(beatTimeUpdateInterval)
    beatTimeUpdateInterval = null
  }
}

const restartBeat = () => {
  if (beatAudio.value) {
    beatAudio.value.currentTime = 0
    beatAudio.value.play()
    isBeatPlaying.value = true
  }
}

const stopBeat = () => {
  if (beatAudio.value) {
    beatAudio.value.pause()
    beatAudio.value.currentTime = 0
    isBeatPlaying.value = false
  }
}


// When the user picks a new beat, load its metadata
watch(
  currentBeat,
  (newBeat) => {
    if (beatAudio.value) {
      beatAudio.value.pause()
      isBeatPlaying.value = false
      beatCurrentTime.value = 0
      if (newBeat) {
        beatAudio.value.src = newBeat.src
        beatAudio.value.load()
        beatAudio.value.addEventListener('loadedmetadata', () => {
          beatDuration.value = beatAudio.value!.duration
        })
      }
    }
  },
  { immediate: true }
)

// 6) Recording state
const micSupported = ref(true)
const isRecording = ref(false)
const recordedChunks = ref<Blob[]>([])
const recordedAudioURL = ref<string | null>(null)
let mediaRecorder: MediaRecorder | null = null

const startRecording = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    micSupported.value = false
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    recordedChunks.value = []

    mediaRecorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.value.push(e.data)
      }
    }

   mediaRecorder.onstop = async () => {
  const blob = new Blob(recordedChunks.value, { type: 'audio/webm' });
  recordedAudioURL.value = URL.createObjectURL(blob);

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const fileName = `recordings/${user.id}_${Date.now()}.webm`

    

const uploadRecordingToSupabase = async (blob: Blob) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('User not logged in')
    return
  }

  const filename = `recording-${uuidv4()}.webm`
  const { data, error } = await supabase.storage
    .from('user-recordings')
    .upload(filename, blob, {
      contentType: 'audio/webm'
    })

  if (error) {
    console.error('Upload error:', error)
    return
  }

  const publicURL = supabase.storage
    .from('user-recordings')
    .getPublicUrl(filename).data.publicUrl

  await supabase.from('recordings').insert({
    user_id: user.id,
    beat_id: currentBeat.value?.id || null,
    beat_title: currentBeat.value?.title || '',
    recording_url: publicURL
  })

  console.log('Recording uploaded & saved.')
}


    // Upload the file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('recordings')
      .upload(fileName, blob)

    if (uploadError) throw uploadError

    const { data: publicUrlData } = supabase
      .storage
      .from('recordings')
      .getPublicUrl(fileName)

    // Save reference to `user_recordings` table
    await supabase.from('user_recordings').insert({
      user_id: user.id,
      beat_id: currentBeat.value?.id || null,
      recording_url: publicUrlData.publicUrl
    })

    console.log('Recording saved successfully.')

  } catch (err) {
    console.error('Failed to save recording:', err)
  }
}


    mediaRecorder.start()
    isRecording.value = true
  } catch (err) {
    console.error('Microphone access error:', err)
    micSupported.value = false
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop()
  }
  isRecording.value = false
}

// 7) Time formatting helper (M:SS)
const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec < 10 ? '0' : ''}${sec}`
}

// 8) Pause all other audio when a new one plays
const onSongPlay = (event: Event) => {
  const playingAudio = event.target as HTMLAudioElement
  // Pause other playlist audios
  document.querySelectorAll<HTMLAudioElement>('.song-audio').forEach(el => {
    if (el !== playingAudio) el.pause()
  })
  // Also pause beat audio if playing
  if (beatAudio.value && beatAudio.value !== playingAudio) {
    beatAudio.value.pause()
  }
}

// 9) Avatar orb logic (reuse home-style orb)
const avatarVideo = ref<HTMLVideoElement | null>(null)
const triggerAvatar = () => {
  if (avatarVideo.value) {
    avatarVideo.value.currentTime = 0
    avatarVideo.value.play()
  }
}

onMounted(() => {
  // Beat audio event listeners
  if (beatAudio.value) {
    beatAudio.value.addEventListener('play', onBeatPlay)
    beatAudio.value.addEventListener('pause', onBeatPauseOrEnd)
    beatAudio.value.addEventListener('ended', onBeatPauseOrEnd)
  }

  // Initialize particles if available
  ;(window as any).particlesJS?.('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#bb86fc' },
      shape: { type: 'circle' },
      opacity: { value: 0.7, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: false },
      move: { enable: true, speed: 1, random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: false }, onclick: { enable: false }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.4 } }
    },
    retina_detect: true
  })
})

onUnmounted(() => {
  if (beatTimeUpdateInterval !== null) {
    clearInterval(beatTimeUpdateInterval)
  }
  if (beatAudio.value) {
    beatAudio.value.removeEventListener('play', onBeatPlay)
    beatAudio.value.removeEventListener('pause', onBeatPauseOrEnd)
    beatAudio.value.removeEventListener('ended', onBeatPauseOrEnd)
  }
})
</script>

<style scoped>
/* ------------------------------------------------------------
   Page Container
   ------------------------------------------------------------ */
.music-page {
  font-family: 'Inter', sans-serif;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
}

/* ------------------------------------------------------------
   Particles Background
   ------------------------------------------------------------ */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* ------------------------------------------------------------
   Left Navigation Orbs
   ------------------------------------------------------------ */
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
.nav-orb {
  width: 60px;
  height: 60px;
  background-color: #bb86fc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}
.nav-orb:hover {
  transform: scale(1.2);
  background-color: #6200ea;
}
.nav-orb.active {
  background-color: #6200ea;
  box-shadow: 0 0 10px rgba(187, 134, 252, 0.5);
}

/* ------------------------------------------------------------
   Main Content Area
   ------------------------------------------------------------ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 0 5rem;
  max-width: 900px;
  z-index: 5;
}

/* ------------------------------------------------------------
   Playlist + Avatar Wrapper
   ------------------------------------------------------------ */
.playlist-machine {
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
}
@media (max-width: 768px) {
  .playlist-machine {
    flex-direction: column;
    gap: 1rem;
  }
}

/* ------------------------------------------------------------
   Avatar Orb Styles
   ------------------------------------------------------------ */
.avatar-orb {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, #1f1f1f 60%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-orb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px #00ffff, 0 0 60px #00ffff;
}
.avatar-video {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* ------------------------------------------------------------
   Playlist Container (styled like tablet-container)
   ------------------------------------------------------------ */
.playlist-container {
  background: #1a1a1a;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(187, 134, 252, 0.3);
  border: 4px solid #333;
  width: 100%;
}

/* ------------------------------------------------------------
   Playlist Section Styles
   ------------------------------------------------------------ */
.section-title {
  font-size: 1.5rem;
  color: #bb86fc;
  margin-bottom: 1rem;
  text-align: center;
}
.playlist-list {
  list-style: none;
  padding: 0;
}
.playlist-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.song-title {
  flex: 1;
  font-size: 1rem;
}
.song-audio {
  width: 200px;
  outline: none;
  border: none;
  background: #222;
  border-radius: 4px;
}

/* ------------------------------------------------------------
   Beat Selection + Recording Container
   ------------------------------------------------------------ */
.tablet-container {
  width: 100%;
  max-width: 800px;
  background: #1a1a1a;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(187, 134, 252, 0.3);
  border: 4px solid #333;
  margin-bottom: 2rem;
}

/* ------------------------------------------------------------
   Beat Selection Styles
   ------------------------------------------------------------ */
.beat-select {
  width: 100%;
  padding: 0.5rem;
  background: #222;
  color: #fff;
  border: 2px solid #444;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
}
.beat-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.control-button {
  background-color: #bb86fc;
  color: #121212;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s, transform 0.2s;
}
.control-button:hover {
  background-color: #6200ea;
  transform: scale(1.05);
}
.beat-duration {
  font-size: 0.9rem;
  color: #fff;
}

/* ------------------------------------------------------------
   Recording Controls Styles
   ------------------------------------------------------------ */
.record-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.error-text {
  color: #f44336;
  text-align: center;
}
.recorded-playback {
  margin-top: 1rem;
  text-align: center;
}
.playback-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
.playback-audio {
  width: 100%;
  outline: none;
  border: none;
  border-radius: 8px;
  background: #222;
}

/* ------------------------------------------------------------
   Responsive Adjustments
   ------------------------------------------------------------ */
@media (max-width: 768px) {
  .main-content {
    padding: 0 1rem;
  }
  .playlist-container,
  .tablet-container {
    max-width: 100%;
    padding: 1rem;
  }
  .playlist-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .song-audio {
    width: 100%;
  }
  .beat-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  .control-button {
    width: 100%;
  }
  .beat-duration {
    margin-top: 0.5rem;
  }
  .nav-orb-container {
    position: static;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .nav-orb {
    width: 50px;
    height: 50px;
    font-size: 0.7rem;
  }
  .section-title {
    font-size: 1.25rem;
  }
  .control-button {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>

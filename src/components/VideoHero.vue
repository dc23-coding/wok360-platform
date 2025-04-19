<template>
  <div class="video-hero">
    <video
      id="landing-video"
      autoplay
      muted
      playsinline
      loop
      v-if="videoUrl"
    >
    <source src="https://yyqcncbnqzurjrtwtpdf.supabase.co/storage/v1/object/sign/files-import/Harvest-Intro.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2U2MzNiZGNiLWM1MmQtNGM4NS1hNWFiLWU1NzE3MTY5YmE1ZiJ9.eyJ1cmwiOiJmaWxlcy1pbXBvcnQvSGFydmVzdC1JbnRyby5tcDQiLCJpYXQiOjE3NDQ5MTU1ODgsImV4cCI6MTc3NjQ1MTU4OH0.Ml5RhWyBEergBxPg33eZ7GRKWUhEBGNLFxkrJ-0SP4U" type="video/mp4" />
    Your browser does not support the video tag.
    </video>

    <div class="overlay"></div>

    <div class="hero-content">
      <h1>Welcome to Metaverse Media</h1>
      <p>Immerse yourself in the future of media.</p>
      <button class="btn" @click="$emit('show-modal')">Enter</button>
    </div>

    <button class="mute-toggle" @click="toggleMute">
      {{ isMuted ? '🔇' : '🔊' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

const videoUrl = ref('')
const isMuted = ref(true)

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const toggleMute = () => {
  const video = document.getElementById('landing-video')
  isMuted.value = !isMuted.value
  video.muted = isMuted.value
}

onMounted(async () => {
  const { data, error } = await supabase
    .storage
    .from('videos')
    .getPublicUrl('Harvest-intro.mp4')

  if (!error) {
    videoUrl.value = data.publicUrl
  } else {
    console.error('Error fetching video:', error)
  }
})
</script>

  


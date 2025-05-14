<template>
  <div class="max-w-3xl mx-auto mt-12 space-y-6">
    <h1 class="text-3xl font-bold text-center">🔥 Remix Feed</h1>
    <div v-if="submissions.length === 0" class="text-center text-muted-foreground">
      No submissions yet. Be the first to join the remix!
    </div>
    <div v-else v-for="submission in submissions" :key="submission.id" class="border rounded-lg p-4 space-y-2">
      <h2 class="text-lg font-semibold">@{{ submission.username }}</h2>
      <p v-if="submission.type === 'Lyrics'" class="italic">{{ submission.content }}</p>
      <audio v-else controls :src="submission.content"></audio>
      <div class="flex gap-2 mt-2">
        <button @click="handleTip(submission.id)" class="nav-orb">💸 Tip with WOK360</button>
        <button @click="handleMint(submission.id)" class="nav-orb">🎨 Mint as NFT</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mockSubmissions = [
  { id: 1, username: 'LyricMaster', type: 'Lyrics', content: 'I’m walking in the future, dancing in the stars…' },
  { id: 2, username: 'VocalQueen', type: 'Audio', content: '/audio/sample1.mp3' },
  { id: 3, username: 'BeatMaker99', type: 'Audio', content: '/audio/sample2.mp3' },
]

const submissions = ref([])

onMounted(() => {
  submissions.value = mockSubmissions
})

const handleTip = (id) => {
  console.log('Tip sent to submission:', id)
  // Wire up blockchain tipping here
}

const handleMint = (id) => {
  console.log('Minting NFT for submission:', id)
  // Wire up NFT minting here
}
</script>

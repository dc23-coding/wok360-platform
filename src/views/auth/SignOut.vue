<!-- src/views/auth/SignOut.vue -->
<template>
  <div class="sign-out-container">
    <button @click="signOut" class="sign-out-button">
      Sign Out
    </button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // Clear any session data
    sessionStorage.removeItem('supabase.auth.token')
    
    // Redirect to sign-in
    router.push('/sign-in')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}
</script>

<style scoped>
.sign-out-container {
  padding: 1rem;
  text-align: center;
}

.sign-out-button {
  background: #ff4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.sign-out-button:hover {
  background: #cc0000;
}
</style>
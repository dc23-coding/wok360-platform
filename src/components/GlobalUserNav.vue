<template>
  <div class="global-user-nav">
    <div class="auth-status" :class="{ 'logged-in': user }">
      <span>{{ user ? user.email : 'Guest Mode' }}</span>
      <button
        v-if="user"
        @click="signOut"
        class="sign-out-btn"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const user = ref<any>(null)
const loading = ref(false)

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user || null

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})

const signOut = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.global-user-nav {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  padding: 20px;
  pointer-events: none;
}

.auth-status {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  gap: 10px;
  pointer-events: all;
}

.auth-status.logged-in {
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
}

.sign-out-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sign-out-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>

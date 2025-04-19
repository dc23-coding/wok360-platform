<template>
    <div class="auth-page">
      <h2>Sign In</h2>
      <input v-model="email" type="email" placeholder="you@example.com" />
      <button @click="signIn">Send Magic Link</button>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { supabase } from '@/lib/supabase'
  
  const email = ref('')
  const error = ref<string|null>(null)
  
  async function signOut() {
    const { error: err } = await supabase.auth.signOutWithOtp({ email: email.value })
    if (err) error.value = err.message
    else alert('Check your email for the magic link!')
  }
  </script>
  
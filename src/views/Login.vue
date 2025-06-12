<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-black text-white">
    <!-- Background Particle Canvas (optional if present on Home.vue) -->
    <!-- <ParticleEffect /> -->

    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">Welcome Back</h1>
      <p class="text-gray-400">Log in to access your dashboard</p>
    </div>
    <p class="mt-4 text-sm text-gray-400">
     Don’t have an account?
    <router-link to="/sign-up" class="text-blue-400 hover:underline">Sign Up</router-link>
    </p>    

    <form @submit.prevent="handleLogin" class="w-full max-w-sm space-y-4 bg-gray-900 p-6 rounded-xl shadow-lg">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-300"
      >
        Login
      </button>
    </form>

    <div class="mt-4 text-gray-500 text-sm">
      <router-link to="/" class="hover:underline">Back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard') // update to your desired protected page
  } catch (error) {
    alert(error.message)
  }
}
</script>

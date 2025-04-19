import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ email: string } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  async function signIn(email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      
      // Mock API call - replace with real authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email === 'test@example.com' && password === 'password') {
        user.value = { email }
        return true
      }
      throw new Error('Invalid credentials')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Authentication failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function signOut() {
    user.value = null
  }

  return { user, loading, error, isAuthenticated, signIn, signOut }
})
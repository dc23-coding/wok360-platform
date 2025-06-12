import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const fetchUser = async () => {
    const { data } = await supabase.auth.getSession()
    user.value = data?.session?.user ?? null
  }

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await fetchUser()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

    onMounted(() => {
        fetchUser()
    })

  return { user, login, logout, fetchUser }
})

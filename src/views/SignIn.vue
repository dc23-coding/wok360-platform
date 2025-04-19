<template>
  <div class="signin-container">
    <div class="auth-card">
      <h2>Access the Universe</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Stellar Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your cosmic address"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Galactic Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" :disabled="auth.loading">
          {{ auth.loading ? 'Warp Jump Initiated...' : 'Enter Portal' }}
        </button>

        <div v-if="auth.error" class="error-message">
          ⚠️ {{ auth.error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const email = ref('test@example.com')
const password = ref('password')

const handleSubmit = async () => {
  const success = await auth.signIn(email.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at center, #0f0f1a, #000);
}

.auth-card {
  background: rgba(25, 25, 35, 0.9);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 2rem rgba(187, 134, 252, 0.2);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

h2 {
  color: #bb86fc;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #bb86fc;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #03dac6;
  box-shadow: 0 0 0 3px rgba(3, 218, 198, 0.2);
}

button {
  width: 100%;
  padding: 1rem;
  background: #bb86fc;
  color: #121212;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #9b6cfc;
  transform: translateY(-2px);
}

.error-message {
  color: #cf6679;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>
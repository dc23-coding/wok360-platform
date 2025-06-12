<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="logo-container">
        <img src="/1logo.png" alt="WOK 360 Logo" class="logo">
      </div>
      
      <h1 class="auth-title">Sign In</h1>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            class="form-input"
            :class="{ 'error-input': emailError }"
          >
          <span v-if="emailError" class="error-text">{{ emailError }}</span>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="••••••••"
            required
            class="form-input"
            :class="{ 'error-input': passwordError }"
          >
          <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading">
          <span v-if="!loading">Sign In</span>
          <span v-else class="loading-spinner"></span>
        </button>
        
        <div class="auth-links">
          <router-link to="/sign-up" class="auth-link">Create an account</router-link>
          <router-link to="/forgot-password" class="auth-link">Forgot password?</router-link>
        </div>
      </form>
      
      <div class="social-login">
        <p class="divider">or continue with</p>
        <button @click="signInWithGoogle" class="social-button google">
          <img src="/google-icon.svg" alt="Google" class="social-icon">
          Google
        </button>
      </div>
      
      <!-- Admin bypass for development -->
      <button v-if="isDev" @click="bypassLogin" class="dev-bypass">
        Bypass Login (Admin Access)
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

export default {
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const emailError = ref('')
    const passwordError = ref('')
    const authError = ref('')
    const isDev = process.env.NODE_ENV === 'development'

    const handleLogin = async () => {
      // Reset errors
      emailError.value = ''
      passwordError.value = ''
      authError.value = ''
      loading.value = true

      // Basic validation
      if (!email.value) {
        emailError.value = 'Email is required'
        loading.value = false
        return
      }

      if (!password.value) {
        passwordError.value = 'Password is required'
        loading.value = false
        return
      }

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })

        if (error) throw error

        // Successful login - redirect to home
        router.push('/home')
      } catch (error: any) {
        console.error('Login error:', error)
        authError.value = error.message || 'Login failed. Please try again.'
        
        // Specific error handling
        if (error.message.includes('Invalid login credentials')) {
          authError.value = 'Invalid email or password'
        } else if (error.message.includes('Email not confirmed')) {
          authError.value = 'Please verify your email first'
        }
      } finally {
        loading.value = false
      }
    }

    const signInWithGoogle = async () => {
      try {
        loading.value = true
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/home'
          }
        })

        if (error) throw error
      } catch (error) {
        console.error('Google sign-in error:', error)
        authError.value = 'Google sign-in failed. Please try again.'
      } finally {
        loading.value = false
      }
    }

    // Admin bypass for development only
    const bypassLogin = () => {
      sessionStorage.setItem('admin-bypass', 'true')
      router.push('/home')
    }

    return {
      email,
      password,
      loading,
      emailError,
      passwordError,
      authError,
      isDev,
      handleLogin,
      signInWithGoogle,
      bypassLogin
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.auth-container {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
}

.logo-container {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  height: 60px;
  width: auto;
}

.auth-title {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #ddd;
  font-size: 14px;
  font-weight: 500;
}

.form-input {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 15px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
}

.error-input {
  border-color: #ff5555;
}

.error-text {
  color: #ff5555;
  font-size: 13px;
  margin-top: 4px;
}

.auth-button {
  background: #00ffff;
  color: #0d0d0d;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-button:hover {
  background: #00e6e6;
  transform: translateY(-1px);
}

.auth-button:disabled {
  background: #00aaaa;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #0d0d0d;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-links {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.auth-link {
  color: #888;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: #00ffff;
}

.social-login {
  margin-top: 30px;
}

.divider {
  color: #666;
  font-size: 14px;
  text-align: center;
  position: relative;
  margin-bottom: 20px;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #444;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background: transparent;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.social-button:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #666;
}

.social-button.google {
  border-color: #4285F4;
  color: #4285F4;
}

.social-button.google:hover {
  background: rgba(66, 133, 244, 0.1);
}

.social-icon {
  width: 18px;
  height: 18px;
}

.dev-bypass {
  margin-top: 30px;
  width: 100%;
  padding: 10px;
  background: transparent;
  color: #888;
  border: 1px dashed #666;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dev-bypass:hover {
  color: #00ffff;
  border-color: #00ffff;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .auth-container {
    padding: 30px 20px;
  }
  
  .auth-title {
    font-size: 22px;
  }
  
  .form-input {
    padding: 10px 14px;
  }
  
  .auth-button {
    padding: 12px;
  }
}
</style>
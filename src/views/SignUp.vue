<template>
    <div class="auth-page">
      <div class="auth-container">
        <h2>Sign Up</h2>
        <form @submit.prevent="handleSignUp">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p v-if="message" :class="{ error: isError }">{{ message }}</p>
        <p>
          Already have an account?
          <router-link to="/sign-in">Sign In</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { supabase } from '@/lib/supabase';
  
  const email = ref('');
  const password = ref('');
  const message = ref('');
  const isError = ref(false);
  
  async function handleSignUp() {
    const { error, data } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) {
      message.value = error.message;
      isError.value = true;
    } else {
      message.value =
        'Sign up successful! Check your email for a confirmation link.';
      isError.value = false;
    }
  }
  </script>
  
  <style scoped>
  .auth-page {
    min-height: 100vh;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-family: 'Inter', sans-serif;
  }
  
  .auth-container {
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(187, 134, 252, 0.5);
    text-align: center;
    width: 90%;
    max-width: 400px;
  }
  
  .auth-container h2 {
    margin-bottom: 1rem;
    color: #bb86fc;
  }
  
  .auth-container input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
  }
  
  .auth-container button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    background: #bb86fc;
    color: #121212;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s, background-color 0.3s;
  }
  
  .auth-container button:hover {
    transform: scale(1.05);
    background: #6200ea;
  }
  
  .auth-container p {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  
  .error {
    color: #e74c3c;
  }
  </style>
  
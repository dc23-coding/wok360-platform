<template>
  <div class="p-8 max-w-md mx-auto text-center">
    <h1 class="text-2xl mb-4">Sign In</h1>

    <form @submit.prevent="handleLogin">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="border p-2 rounded w-full mb-2"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 rounded w-full mb-4"
      />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Login
      </button>
    </form>

    <!-- ✅ Admin Access Bypass Button -->
    <button @click="bypassLogin" class="mt-4 text-sm underline text-blue-500">
      Bypass Login (Admin Access)
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

function handleLogin() {
  // ✅ Implement your real login validation here
  console.log('Logging in as:', username.value);
  router.push('/home'); // ✅ Go to the Home page after login
}

// ✅ Admin Access Bypass - goes to /home directly
function bypassLogin() {
  sessionStorage.setItem('admin-bypass', 'true');  // ✅ Enable bypass session
  router.push('/mureka');  // ✅ Go directly to StudioHome after bypass
}

</script>

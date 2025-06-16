<template>
  <div class="modal">
    <div class="modal-content">
      <h3 class="text-lg font-bold">🏆 My Rewards</h3>
      <ul>
        <li v-for="reward in rewards" :key="reward.id">
          {{ reward.source }} – {{ reward.points }} pts
        </li>
      </ul>
      <button @click="$emit('close')" class="close-btn">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/composables/useUser';

const { user } = useUser();
const rewards = ref([]);

onMounted(async () => {
  const { data, error } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false });

  if (!error) rewards.value = data;
});
</script>

<style scoped>
.modal { @apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50; }
.modal-content { @apply bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full; }
.close-btn { @apply mt-4 text-white bg-red-500 px-4 py-2 rounded; }
</style>

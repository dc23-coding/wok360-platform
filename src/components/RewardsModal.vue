<!-- src/components/RewardsModal.vue -->
<template>
  <div class="modal-overlay" v-if="visible">
    <div class="modal-box">
      <h2 class="modal-title">Redeem Clothing Rewards</h2>
      <ul class="reward-tiers">
        <li v-for="tier in tiers" :key="tier.id" class="reward-item">
          <span class="reward-label">{{ tier.label }}</span>
          <span class="reward-desc">{{ tier.description }}</span>
          <button
            :disabled="userPoints < tier.points || claimedTiers.includes(tier.id)"
            @click="claimReward(tier)"
            class="claim-btn"
          >
            {{ claimedTiers.includes(tier.id) ? 'Claimed' : 'Claim' }}
          </button>
        </li>
      </ul>
      <button class="close-btn" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';

const props = defineProps({ visible: Boolean });
const emit = defineEmits(['close']);
const auth = useAuthStore();
const user = ref(auth.user);
const userPoints = ref(0);
const claimedTiers = ref([]);

const tiers = [
  { id: 1, label: 'Tier 1', points: 1000, description: 'Stickers' },
  { id: 2, label: 'Tier 2', points: 25000, description: 'Shirt' },
  { id: 3, label: 'Tier 3', points: 50000, description: 'Full Outfit' },
];

const fetchStatus = async () => {
  const { data: meta } = await supabase
    .from('users_meta')
    .select('game_points')
    .eq('user_id', user.value.id)
    .single();
  userPoints.value = meta?.game_points || 0;

  const { data: claims } = await supabase
    .from('reward_claims')
    .select('tier_id')
    .eq('user_id', user.value.id);
  claimedTiers.value = claims?.map(c => c.tier_id) || [];
};

const claimReward = async (tier) => {
  if (userPoints.value >= tier.points && !claimedTiers.value.includes(tier.id)) {
    await supabase.from('reward_claims').insert([
      { user_id: user.value.id, tier_id: tier.id, reward: tier.description },
    ]);
    claimedTiers.value.push(tier.id);
  }
};

onMounted(fetchStatus);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-box {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  color: #fff;
}
.modal-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #bb86fc;
}
.reward-tiers {
  list-style: none;
  padding: 0;
}
.reward-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.reward-label {
  font-weight: bold;
}
.reward-desc {
  margin-left: auto;
  margin-right: 1rem;
  font-style: italic;
}
.claim-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  border: none;
  background: #bb86fc;
  color: #121212;
  cursor: pointer;
}
.claim-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.close-btn {
  margin-top: 2rem;
  background: #444;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>

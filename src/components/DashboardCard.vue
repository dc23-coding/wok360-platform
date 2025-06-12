<!-- src/components/DashboardCard.vue -->
<template>
  <div class="card">
    <div class="icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String
})
</script>

<style scoped>
.card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 12px rgba(187, 134, 252, 0.3);
  text-align: center;
  color: #fff;
  transition: transform 0.3s;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px #bb86fc;
}

.icon {
  font-size: 2rem;
  margin-bottom: 10px;
}
</style>

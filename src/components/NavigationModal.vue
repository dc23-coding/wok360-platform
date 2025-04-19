<template>
  <div class="modal" v-if="visible">
    <div class="modal-content">
      <h2>Select a Section</h2>
      <button class="modal-btn" @click="navigateToRoute('home')">Home</button>
      <button class="modal-btn" @click="navigateToRoute('episodes')">Episodes</button>
      <button class="modal-btn" @click="navigateToRoute('music')">Music</button>
      <button class="modal-btn" @click="navigateToRoute('games')">Games</button>
      <button class="modal-close" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['visible'],
  emits: ['close'],
  methods: {
    navigateToRoute(routeName) {
      this.$router.push({ name: routeName }); // Use route name for navigation
      this.$emit('close'); // Close the modal after navigation
    },
  },
};
</script>

<style scoped src="@/assets/styles/modal.css"></style>

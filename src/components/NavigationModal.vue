<!-- src/components/NavigationModal.vue -->
<template>
  <div class="modal-backdrop" v-if="visible">
    <div class="modal-content">
      <h2>Select a Section</h2>
      <button class="modal-btn" @click="navigateToRoute('Home')">Home</button>
      <button class="modal-btn" @click="navigateToRoute('Episodes')">Episodes</button>
      <button class="modal-btn" @click="navigateToRoute('Music')">Music</button>
      <button class="modal-btn" @click="navigateToRoute('Games')">Games</button>
      <button class="modal-close" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// defineProps is a macro and needs no import
const props = defineProps<{ visible: boolean }>()

// defineEmits with array literal and "as const" so TS infers the literal type
const emit = defineEmits(['close'] as const)

const router = useRouter()

function navigateToRoute(routeName: string) {
  router.push({ name: routeName })
  emit('close')
}
</script>

<style scoped src="@/assets/styles/modal.css"></style>

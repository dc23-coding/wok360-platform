<template>
  <Particles :id="'tsparticles'" :options="options" />
</template>

<script setup>
import Particles from '@tsparticles/vue3'
import { particlesOptions } from '@/config/ParticlesConfig'

const options = particlesOptions
</script>

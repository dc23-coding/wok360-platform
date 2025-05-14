<template>
  <canvas ref="canvas" class="fixed inset-0 -z-10"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const canvas = ref(null)

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.value.width,
    y: Math.random() * canvas.value.height,
    radius: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5,
  }))

  function animate() {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    particles.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = '#0A84FF'
      ctx.fill()
      p.x += p.dx
      p.y += p.dy

      if (p.x < 0 || p.x > canvas.value.width) p.dx *= -1
      if (p.y < 0 || p.y > canvas.value.height) p.dy *= -1
    })
    requestAnimationFrame(animate)
  }

  animate()
})
</script>

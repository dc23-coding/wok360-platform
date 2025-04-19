import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('Vue3Lottie')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './public')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    host: true,
    strictPort: true
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          particles: ['@tsparticles/vue3', '@tsparticles/slim'],
          auth: ['pinia']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@tsparticles/vue3',
      '@tsparticles/slim',
      'vue',
      'vue-router'
    ]
  },
  define: {
    'process.env': {},
    __VUE_PROD_DEVTOOLS__: false
  }
})
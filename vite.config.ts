import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/laminor2/',
  build: {
    outDir: 'dist/laminor2',
  },
  plugins: [vue()],
})

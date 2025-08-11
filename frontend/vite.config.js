import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5000,
    proxy: {
      '/api': 'http://localhost:3000', // 백엔드 API 프록시
    },
  },
})
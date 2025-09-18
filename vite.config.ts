import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/data-portal-front-Json/',  // 👈 must match repo name exactly
  plugins: [react()],
})
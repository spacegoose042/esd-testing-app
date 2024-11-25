import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: process.env.PORT || 5000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})

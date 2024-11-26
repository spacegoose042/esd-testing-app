import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.RAILWAY_URL || 'http://localhost:5001',
        changeOrigin: true,
        secure: true
      }
    }
  }
});

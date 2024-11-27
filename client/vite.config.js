import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.RAILWAY_STATIC_URL || 'https://esd-testing-app-production.up.railway.app')
  },
  build: {
    outDir: '../server/public',
    emptyOutDir: true
  },
  server: {
    port: process.env.PORT || 5173,
    host: '0.0.0.0'
  }
});

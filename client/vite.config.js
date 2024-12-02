import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
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

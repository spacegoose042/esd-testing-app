import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    },
    build: {
      outDir: '../server/public',
      emptyOutDir: true
    },
    server: {
      port: process.env.PORT || 5173,
      host: '0.0.0.0'
    }
  };
});

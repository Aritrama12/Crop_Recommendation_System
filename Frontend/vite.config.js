import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    watch: {
      usePolling: true,  // 👈 enables reliable file watching on Windows
      interval: 100,     // check every 100ms for changes
    },
    host: true,
    port: 5173,
  },
})

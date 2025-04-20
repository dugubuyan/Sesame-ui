import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': {},
    'process': { env: {} },
    'Buffer': ['buffer', 'Buffer']
  },
  resolve: {
    alias: {
      'buffer': 'buffer/',
      'process': 'process/browser'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})

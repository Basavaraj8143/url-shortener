import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Known frontend routes — everything else is a short code → proxy to backend
const FRONTEND_PATHS = ['/', '/login', '/register', '/dashboard']

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Catch-all: proxy short code paths to the backend
      '/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass(req) {
          const path = (req.url ?? '/').split('?')[0]

          // Let Vite handle: known frontend routes, static assets, HMR
          const isFrontendRoute =
            FRONTEND_PATHS.some(p => path === p) ||
            path.startsWith('/dashboard') ||
            path.startsWith('/src') ||
            path.startsWith('/@') ||
            path.startsWith('/node_modules') ||
            path.includes('.')   // .jsx, .css, .svg, etc.

          return isFrontendRoute ? req.url : undefined
          // returning undefined → Vite forwards to target (backend)
        },
      },
    },
  },
})

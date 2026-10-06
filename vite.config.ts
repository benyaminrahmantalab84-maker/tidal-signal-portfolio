import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import handler from './api/scope.js'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-scope-api',
      configureServer(server) {
        server.middlewares.use('/api/scope', (req, res) => {
          void handler(req, res)
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use('/api/scope', (req, res) => {
          void handler(req, res)
        })
      },
    },
  ],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Mirrors the /solver rewrite in vercel.json so the API is same-origin everywhere (no CORS).
  // `vite preview` inherits this proxy.
  server: {
    port: 5173,
    strictPort: true,
    proxy: { '/solver': 'http://localhost:8080' },
  },
})

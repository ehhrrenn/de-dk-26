import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from Firebase Hosting at the domain root (both the live site and
// PR preview channel URLs), so no repo-name subpath is needed.
export default defineConfig({
  plugins: [react()],
})

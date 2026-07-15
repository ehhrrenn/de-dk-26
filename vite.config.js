import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Repo is served at https://<user>.github.io/<repo-name>/
// so the base path has to match the repo name exactly.
export default defineConfig({
  plugins: [react()],
  base: '/de-dk-26/',
})

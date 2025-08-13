import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'discord-presence';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
})

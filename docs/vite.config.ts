// vite.config.ts
import { defineConfig } from 'vite'
import { searchIndexPlugin } from './scripts/search-index.js'

export default defineConfig({
  plugins: [searchIndexPlugin()],
})
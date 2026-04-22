import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite-ga tailwind pluginini qo'shyapmiz
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
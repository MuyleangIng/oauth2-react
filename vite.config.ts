import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
  },
})
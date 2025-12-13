import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Ensure we always return a string, even if env.API_KEY is missing.
      // This prevents "ReferenceError: process is not defined" in the browser.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})
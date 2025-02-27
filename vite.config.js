import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteBasicSslPlugin(), nodePolyfills()],
  test: {
    environment: 'happy-dom',
    mockReset: false,
  },
})

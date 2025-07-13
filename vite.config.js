import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env': process.env
  },
  css: {
    // Completely disable PostCSS processing for Sanity Studio
    postcss: false,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  server: {
    hmr: {
      overlay: false,
      port: 24678 // Custom HMR port to avoid conflicts
    },
    host: true,
    port: 3333
  },
  clearScreen: false,
  logLevel: 'warn',
  // Optimize deps to exclude problematic packages
  optimizeDeps: {
    exclude: ['@tailwindcss/postcss', 'tailwindcss']
  },
  // Ensure clean builds
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
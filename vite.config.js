import { defineConfig } from 'vite'

export default defineConfig({
    // Basic configuration for static site
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
        open: true
    }
})

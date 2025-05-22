import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'), 
  publicDir: 'public', 

  base: '/DicodingStory/', 

  build: {
    outDir: 'docs', 
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src', 'index.html'), 
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), 
    },
  },
  server: {
    open: '/',
  },
});
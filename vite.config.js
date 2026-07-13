import { defineConfig } from 'vite';

export default defineConfig({
  base: "/pokemon-explorer/",
  server: {
    fs: {
      allow: ['..']
    }
  }
});
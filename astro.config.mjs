// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://alnoor-bakery.vercel.app',
  output: 'static', // Static site generation
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  },
  vite: {
    optimizeDeps: {
      exclude: []
    }
  }
});

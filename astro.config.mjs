// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://alnoor-bakery.vercel.app',
  output: 'static',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwind()],
  },
});
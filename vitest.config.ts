import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      include: ['tests/**/*.{test,spec}.{js,ts}'],
      exclude: [
        'node_modules',
        'dist',
        '.astro'
      ]
    },
    define: {
      __TEST_ENV__: JSON.stringify(env)
    }
  };
});
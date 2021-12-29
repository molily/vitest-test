import preact from '@preact/preset-vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const dirname = new URL('.', import.meta.url).pathname;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      preact(),
    ],
    build: {
      minify: isProduction,
      rollupOptions: {
        input: {
          index: resolve(dirname, 'index.html'),
        },
      },
    },
    test: {
      environment: 'jsdom',
    },
  };
});

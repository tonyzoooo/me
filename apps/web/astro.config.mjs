// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@layouts': path.resolve('./src/layouts'),
        '@components': path.resolve('./src/components'),
        '@pages': path.resolve('./src/pages'),
        '@utils': path.resolve('./src/utils'),
        '@styles': path.resolve('./src/styles'),
      },
    },
  },
  integrations: [mdx()],
  site: 'https://blog.tonyzoooo.me',
});

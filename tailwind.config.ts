import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './src/content/**/*.{md,mdx}'],
  theme: { extend: {} },
};

export default config;

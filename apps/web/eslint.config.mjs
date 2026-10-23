import { config } from '@repo/eslint-config/base';
import astro from 'eslint-plugin-astro';

// The TypeScript parser provided by the shared base config.
const tsParser = config.find((entry) => entry?.languageOptions?.parser)
  ?.languageOptions.parser;

export default [
  ...config,
  ...astro.configs.recommended,
  {
    // eslint-plugin-astro lints frontmatter as virtual `*.astro/*.ts` files.
    // Pin the TypeScript parser for them explicitly so they are never
    // parsed as plain JavaScript.
    files: ['**/*.astro/*.ts', '**/*.astro/*.js'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    ignores: ['dist/**', '.astro/**', '.vercel/**', 'node_modules/**'],
  },
];

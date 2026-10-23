import { config } from '@repo/eslint-config/react-internal';

const eslintConfig = [
  ...config,
  {
    ignores: ['node_modules/**'],
  },
];

export default eslintConfig;

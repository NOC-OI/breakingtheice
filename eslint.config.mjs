import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypeScript,

  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error'
    }
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },

  prettierConfig
]);

export default eslintConfig;

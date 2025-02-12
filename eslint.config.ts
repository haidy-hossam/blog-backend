import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
//@ts-expect-error add eslint plugin promise
import pluginPromise from 'eslint-plugin-promise';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.ts'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  { plugins: { promise: pluginPromise } },
  {
    rules: {
      'no-console': 'error',
      'consistent-return': 'error',
      'default-case': 'warn',
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
    },
  },
];

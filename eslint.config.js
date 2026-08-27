import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
  },

  {
    rules: {
      // Tắt rule JS gốc
      'no-unused-vars': 'off',

      // Khai báo không dùng → warning
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];

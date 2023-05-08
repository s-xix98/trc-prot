module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // '@/features' からの import 禁止
    // 相対パスで 無理やり import すれば import できてしまう、、
    'no-restricted-imports': ['error', { patterns: ['@/features/*/*'] }],
    // import の 順番指定
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        pathGroups: [
          {
            pattern: '@/**',
            position: 'before',
            group: 'internal',
          },
          {
            pattern: '../**',
            position: 'before',
            group: 'internal',
          },
          {
            pattern: './**',
            position: 'before',
            group: 'internal',
          },
        ],
        // グループごとに改行を入れる
        'newlines-between': 'always',
      },
    ],
  },
};

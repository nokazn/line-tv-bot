module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-base',
    'plugin:jest/all',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    // switch 文での prettier との競合を防ぐ
    indent: [2, 2, { SwitchCase: 1 }],
    'lines-between-class-members': 0,
    'no-console': 1,
    'arrow-body-style': 0,

    /**
     * eslint-plugin-import
     */
    'import/extensions': [
      2,
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
        json: 'never',
      },
    ],
    'import/no-unresolved': 0,
    // typescript-eslint の no-use-before-define を有効にする
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 2,
    // 'import/no-unresolved': [1, { commonjs: true, amd: true }],
    'import/no-extraneous-dependencies': [1, { devDependencies: true }],
    'import/prefer-default-export': 0,

    // typescript-eslint の no-unuserd-vars を有効にする
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 2,
  },
};

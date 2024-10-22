const ALLOW = 0;
const WARN = 1;
const ERROR = 2;

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
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-base',
    'plugin:jest/all',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'lines-between-class-members': ALLOW,
    'no-console': WARN,
    'arrow-body-style': ALLOW,
    'no-undef': ALLOW,

    // airbnb のスタイルから for of 文の禁止の部分を削除
    // See also https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L337-L357
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],

    // eslint-plugin-import
    'import/extensions': [
      ERROR,
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
        json: 'never',
      },
    ],
    'import/no-unresolved': ALLOW,
    'import/no-extraneous-dependencies': [1, { devDependencies: true }],
    'import/prefer-default-export': ALLOW,

    // typescript-eslint のオプションを有効にする
    'no-use-before-define': ALLOW,
    '@typescript-eslint/no-use-before-define': ERROR,
    'no-unused-vars': ALLOW,
    '@typescript-eslint/no-unused-vars': ERROR,

    // typescript-eslint 特有のオプション
    '@typescript-eslint/consistent-type-assertions': [WARN, { assertionStyle: 'never' }],
    '@typescript-eslint/no-explicit-any': ERROR,
    '@typescript-eslint/no-non-null-assertion': ERROR,
    '@typescript-eslint/no-confusing-non-null-assertion': ERROR,
    '@typescript-eslint/prefer-ts-expect-error': ERROR,
    '@typescript-eslint/require-await': ALLOW,
    '@typescript-eslint/no-floating-promises': ALLOW,

    // jest/all
    'jest/require-hook': ALLOW,
  },
};

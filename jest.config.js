module.exports = {
  roots: ['.'],
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules'],
};

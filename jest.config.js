module.exports = {
  roots: ['.'],
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules'],
};

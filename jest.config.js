module.exports = {
  roots: ['.'],
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: true,
        module: {
          type: 'commonjs',
        },
        jsc: {
          parser: {
            syntax: 'typescript',
          },
        },
      },
    ],
  },
  testMatch: ['**/{src,tests}/**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules'],
};

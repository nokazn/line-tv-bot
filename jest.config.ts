import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
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
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src/$1',
    '^~~(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/{src,tests}/**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules'],
  testTimeout: 10 * 60 * 1000,
};

export default config;

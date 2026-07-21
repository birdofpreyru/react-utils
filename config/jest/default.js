import { resolve } from 'node:path';
import { execPath } from 'node:process';

const globalLibDir = resolve(execPath, '../../lib/node_modules');

export default {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: '__coverage__',
  extensionsToTreatAsEsm: ['.svg', '.ts', '.tsx'],
  moduleDirectories: [
    'node_modules',
    globalLibDir,
  ],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  resolver: `${import.meta.dirname}/resolver.js`,
  rootDir: '../..',
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/setup.js',
  ],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  testMatch: ['**/__tests__/**/*.(j|t)s?(x)'],
  testPathIgnorePatterns: [
    '/__assets__/',
    '/node_modules/',
  ],
  transform: {
    '\\.((j|t)sx?|svg)$': 'babel-jest',
  },
};

const path = require('path');

const globalLibDir = path.resolve(process.execPath, '../../lib/node_modules');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: '__coverage__',
  moduleDirectories: [
    'node_modules',
    globalLibDir,
  ],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  resolver: `${__dirname}/resolver.js`,
  rootDir: '../..',
  testMatch: ['**/__tests__/**/*.(j|t)s?(x)'],
  testPathIgnorePatterns: [
    '/__assets__/',
    '/node_modules/',
  ],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  transform: {
    '\\.((j|t)sx?|svg)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@dr.pogodin/react-utils)',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/setup.js',
  ],
};

/**
 * @category Configs
 * @module jest
 * @desc Configuration for [Jest](https://facebook.github.io/jest/)
 * (JavaScript testing framework).
 *
 * **Beware:** It assumes you use recommended code structure in the project
 * using it: Jest configs in `config/jest` folder, the source code in `src`
 * folder, the build outputs in `build` folder, _etc._ With a different
 * project structure, it might be easier to compose necessary Jest config
 * from scratch.
 *
 * To set up create these two files in `config/jest` folder of your project:
 * ```js
 * // config/jest/config.js
 *
 * const config = require('@dr.pogodin/react-utils/config/jest/default');
 * // You can tune config as necessary here.
 * module.exports = config;
 * ```
 * ```js
 * // config/jest/setup.js
 *
 * import '@dr.pogodin/react-utils/config/jest/setup';
 * ```
 * Then point that config in Jest command, like so:
 * ```
 * jest --config config/jest/config.js
 * ```
 *
 * The current Jest environment setup script provided by `react-utils`
 * only loads `raf/polyfill`, required by React.
 */

const path = require('path');

const globalLibDir = path.resolve(process.execPath, '../../lib/node_modules');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
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
  rootDir: '../..',
  testMatch: ['**/__tests__/**/*.js?(x)'],
  testPathIgnorePatterns: [
    '/__assets__/',
    '/node_modules/',
  ],
  testURL: 'http://localhost',
  transform: {
    '\\.(jsx?|svg)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@dr.pogodin/react-utils)',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/setup.js',
  ],
};

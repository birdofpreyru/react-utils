/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'eslint/config';

import eslintConfigs from '@dr.pogodin/eslint-configs';

export default defineConfig([{
  ignores: [
    '*.d.ts',
    '__coverage__',
    'build/',
    'docs/build/',
  ],
}, {
  name: '@dr.pogodin/react-utils/common',

  extends: [
    eslintConfigs.configs.javascript,
    eslintConfigs.configs.typescript,
    eslintConfigs.configs.react,
  ],
  ignores: ['__tests__/**'],
}, {
  name: '@dr.pogodin/react-utils/tests',

  extends: [
    eslintConfigs.configs.javascript,
    eslintConfigs.configs.typescript,
    eslintConfigs.configs.react,
    eslintConfigs.configs.jest,
  ],
  files: ['__tests__/**'],
}]);

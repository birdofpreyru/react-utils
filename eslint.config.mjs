import config from './config/eslint/default.mjs';

config.push(
  {
    ignores: [
      'bin/build.js',
      'config/babel/',
      'config/webpack/',
      'docs/.docusaurus/',
    ],
  },
);

export default config;

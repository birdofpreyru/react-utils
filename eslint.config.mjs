import config from './config/eslint/default.mjs';

config.push(
  {
    ignores: [
      'bin/build.js',
      'bin/run-with-babel.js',
      'config/babel/',
      'config/webpack/',
      'docs/.docusaurus/',
    ],
  },
);

export default config;

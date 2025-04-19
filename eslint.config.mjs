import config from './config/eslint/default.mjs';

config.push(
  {
    ignores: [
      'config/babel/',
      'config/webpack/',
      'docs/.docusaurus/',
    ],
  },
);

export default config;

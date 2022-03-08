const build = process.env.NODE_ENV === 'production'
  ? 'production' : 'development';

// eslint-disable-next-line import/no-dynamic-require
module.exports = require(`./build/${build}`);

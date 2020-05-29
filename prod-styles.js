const lib = require('./index');

if (lib.isomorphy.IS_CLIENT_SIDE) {
  /* eslint-disable global-require */
  require('./build/production/style.css');
  /* eslint-enable global-require */
}

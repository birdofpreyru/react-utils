const { isomorphy } = require('.');

if (isomorphy.isClientSide()) {
  /* eslint-disable global-require */
  require('./build/production/style.css');
  /* eslint-enable global-require */
}

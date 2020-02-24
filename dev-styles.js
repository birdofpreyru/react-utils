const { isomorphy } = require('./index');

if (isomorphy.isClientSide()) {
  /* eslint-disable global-require */
  require('./build/development/style.css');
  /* eslint-enable global-require */
}

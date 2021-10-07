/**
 * Misc utilities reusable in different JS-format config files.
 */

const {
  generateScopedNameFactory,
} = require('@dr.pogodin/babel-plugin-react-css-modules/utils');

const generateScopedNameDev = generateScopedNameFactory(
  '[package]___[path][name]___[local]___[hash:base64:6]',
);

const generateScopedNameProd = generateScopedNameFactory(
  '[hash:base64:6]',
);

module.exports = {
  generateScopedNameDev,
  generateScopedNameProd,
};

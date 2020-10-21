/**
 * Misc utilities reusable in different JS-format config files.
 */
/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');

const { interpolateName } = require('loader-utils');

/**
 * Normalizes file path to OS-independent format (adopted from css-loader).
 * @param {string} file
 * @return {string}
 */
function normalizePath(file) {
  return path.sep === '\\' ? file.replace(/\\/g, '/') : file;
}

/**
 * Returns the name of package containing the folder; i.e. it recursively looks
 * up from the folder for the closest package.json file, and returns the name in
 * that file. It also caches the results from previously fisited folders.
 * @param {string} folder
 * @return {string}
 */
function getPackageInfo(folder) {
  let res = getPackageInfo.cache[folder];
  if (!res) {
    const p = path.resolve(folder, 'package.json');
    /* eslint-disable global-require, import/no-dynamic-require */
    res = fs.existsSync(p) ? {
      name: require(p).name,
      root: folder,
    } : getPackageInfo(path.resolve(folder, '..'));
    /* eslint-enable global-require, import/no-dynamic-require */
    getPackageInfo.cache[folder] = res;
  }
  return res;
}
getPackageInfo.cache = {};

function getLocalIdent(
  { resourcePath },
  localIdentName,
  localName,
  options,
) {
  const packageInfo = getPackageInfo(path.dirname(resourcePath));
  const request = normalizePath(path.relative(packageInfo.root, resourcePath));
  const res = interpolateName({
    resourcePath,
  }, localIdentName, {
    ...options,
    content: `${packageInfo.name + request}\x00${localName}`,
    context: packageInfo.root,
  }).replace(/\[package\]/gi, packageInfo.name)
    .replace(/[<>:"/\\|?*@.]/gi, '-')
    .replace(/\[local\]/gi, localName);
  return res;
}

function generateScopedNameDev(localName, assetPath) {
  return getLocalIdent(
    { resourcePath: assetPath },
    '[package]___[path][name]___[local]___[hash:base64:6]',
    localName,
    {},
  );
}

function generateScopedNameProd(localName, assetPath) {
  return getLocalIdent(
    { resourcePath: assetPath },
    '[hash:base64:6]',
    localName,
    {},
  );
}

module.exports = {
  generateScopedNameDev,
  generateScopedNameProd,
  getLocalIdent,
};

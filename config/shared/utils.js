/**
 * Misc utilities reusable in different JS-format config files.
 */
/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');
const cssesc = require('cssesc');

const { interpolateName } = require('loader-utils');

/**
 * Normalizes file path to OS-independent format (adopted from css-loader).
 * @ignore
 * @param {string} file
 * @return {string}
 */
function normalizePath(file) {
  return path.sep === '\\' ? file.replace(/\\/g, '/') : file;
}

// eslint-disable-next-line no-control-regex
const filenameReservedRegex = /[<>:"/\\|?*]/g;
// eslint-disable-next-line no-control-regex
const reControlChars = /[\u0000-\u001f\u0080-\u009f]/g;

function escapeLocalident(localident) {
  return cssesc(
    localident
      // For `[hash]` placeholder
      .replace(/^((-?[0-9])|--)/, '_$1')
      .replace(filenameReservedRegex, '-')
      .replace(reControlChars, '-')
      .replace(/\./g, '-'),
    { isIdentifier: true },
  );
}

/**
 * Returns the name of package containing the folder; i.e. it recursively looks
 * up from the folder for the closest package.json file, and returns the name in
 * that file. It also caches the results from previously fisited folders.
 * @ignore
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
  options = {},
) {
  const packageInfo = getPackageInfo(path.dirname(resourcePath));
  const request = normalizePath(path.relative(packageInfo.root, resourcePath));
  return interpolateName({
    resourcePath,
  }, localIdentName, {
    ...options,
    content: `${packageInfo.name + request}\x00${localName}`,
    context: packageInfo.root,
  }).replace(/\[package\]/gi, packageInfo.name)
    .replace(/\[local\]/gi, localName)
    .replace(/@/g, '-');
}

function generateScopedNameDev(localName, assetPath) {
  // Mind: "css-loader" additionally escapes identifiers returned by
  // getLocalIdent(); the babel plugins - don't, thus we need to escape
  // ourselves.
  return escapeLocalident(
    getLocalIdent(
      { resourcePath: assetPath },
      '[package]___[path][name]___[local]___[hash:base64:6]',
      localName,
      {},
    ),
  );
}

function generateScopedNameProd(localName, assetPath) {
  return escapeLocalident(
    getLocalIdent(
      { resourcePath: assetPath },
      '[hash:base64:6]',
      localName,
      {},
    ),
  );
}

module.exports = {
  generateScopedNameDev,
  generateScopedNameProd,
  getLocalIdent,
};

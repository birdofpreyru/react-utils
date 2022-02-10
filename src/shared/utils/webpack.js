import { IS_SERVER_SIDE } from './isomorphy';

/**
 * Requires the specified module without including it into the bundle during
 * Webpack build.
 * @param {string} modulePath
 * @param {string} [basePath]
 * @return {object} Required module.
 */
export function requireWeak(modulePath, basePath) {
  if (!IS_SERVER_SIDE) return null;

  /* eslint-disable no-eval */
  const { resolve } = eval('require')('path');
  const path = basePath ? resolve(basePath, modulePath) : modulePath;
  const { default: def, ...named } = eval('require')(path);
  /* eslint-enable no-eval */

  if (!def) return named;

  Object.entries(named).forEach(([key, value]) => {
    if (def[key]) throw Error('Conflict between default and named exports');
    def[key] = value;
  });
  return def;
}

/**
 * Resolves specified module path with help of Babel's module resolver.
 * Yes, the function itself just returns its argument to the caller, but Babel
 * is configured to resolve the first argument of resolveWeak(..) function, thus
 * the result will be the resolved path.
 * @param {string} modulePath
 * @return {string} Absolute or relative path to the module.
 */
export function resolveWeak(modulePath) {
  return modulePath;
}

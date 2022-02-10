import { IS_SERVER_SIDE } from './isomorphy';

/**
 * @category Utilities
 * @module webpack
 * @desc
 * ```js
 * import { webpack } from '@dr.pogodin/react-utils';
 * ```
 * Webpack-related utilities.
 */

/**
 * ```js
 * import { webpack } from '@dr.pogodin/react-utils';
 * const { requireWeak } = webpack;
 * ```
 * Requires the specified module without including it into the bundle during
 * Webpack build. This function should be executed only server-side.
 *
 * WARNING: Beware to pass in relative paths: they will be resolved relative
 * to the library distribution function, this is not what you want in most of
 * cases. To convert a relative path to the absolute one, do in the caller code
 * ```
 * import path from 'path';
 * const p = path.resolve(__dirname, './relative/path');
 * const module = requireWeak(p);
 * ```
 * In case you use an absolute path that relies on Babel module resolver,
 * pass it through resolveWeak function below.
 *
 * @param {string} modulePath
 * @param {string} [basePath]
 * @return {object} Required module.
 */
export function requireWeak(modulePath, basePath) {
  if (!IS_SERVER_SIDE) return undefined;

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

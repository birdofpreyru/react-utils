import { IS_CLIENT_SIDE } from './isomorphy';

/**
 * Requires the specified module without including it into the bundle during
 * Webpack build.
 * @param modulePath
 * @param [basePath]
 * @return Required module.
 */
export function requireWeak<Module extends NodeJS.Module>(
  modulePath: string,
  basePath?: string,
): Module | null {
  if (IS_CLIENT_SIDE) return null;

  // TODO: On one hand, this try/catch wrap silencing errors is bad, as it may
  // hide legit errors, in a way difficult to notice and understand; but on the
  // other hand it fails for some (unclear, but legit?) reasons in some environments,
  // like during the static code generation for docs. Perhaps, something should
  // be implemented differently here.
  try {
    /* eslint-disable no-eval */
    const { resolve } = eval('require')('path');
    const path = basePath ? resolve(basePath, modulePath) : modulePath;
    const module = eval('require')(path) as Module;
    /* eslint-enable no-eval */

    if (!('default' in module) || !module.default) return module;

    const { default: def, ...named } = module;

    const res = def as Module;

    Object.entries(named).forEach(([name, value]) => {
      const assigned = res[name as keyof Module];
      if (assigned !== undefined) {
        if (assigned !== value) {
          throw Error('Conflict between default and named exports');
        }
      } else res[name as keyof Module] = value;
    });
    return res;
  } catch {
    return null;
  }
}

/**
 * Resolves specified module path with help of Babel's module resolver.
 * Yes, the function itself just returns its argument to the caller, but Babel
 * is configured to resolve the first argument of resolveWeak(..) function, thus
 * the result will be the resolved path.
 * @param {string} modulePath
 * @return {string} Absolute or relative path to the module.
 */
export function resolveWeak(modulePath: string): string {
  return modulePath;
}

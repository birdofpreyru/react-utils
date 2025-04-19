import type PathT from 'path';

import { IS_CLIENT_SIDE } from './isomorphy';

type RequireWeakResT<T> = T extends { default: infer D } ? D & Omit<T, 'default'> : T;

/**
 * Requires the specified module without including it into the bundle during
 * Webpack build.
 * @param modulePath
 * @param [basePath]
 * @return Required module.
 */
export function requireWeak<T extends object>(
  modulePath: string,
  basePath?: string,
): RequireWeakResT<T> | null {
  if (IS_CLIENT_SIDE) return null;

  // TODO: On one hand, this try/catch wrap silencing errors is bad, as it may
  // hide legit errors, in a way difficult to notice and understand; but on the
  // other hand it fails for some (unclear, but legit?) reasons in some
  // environments,
  // like during the static code generation for docs. Perhaps, something should
  // be implemented differently here.
  try {
    // eslint-disable-next-line no-eval
    const req = eval('require') as (path: string) => unknown;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { resolve } = req('path') as typeof PathT;

    const path = basePath ? resolve(basePath, modulePath) : modulePath;
    const module = req(path) as T;

    if (!('default' in module) || !module.default) return module as RequireWeakResT<T>;

    const { default: def, ...named } = module;

    const res = def as RequireWeakResT<T>;

    Object.entries(named).forEach(([name, value]) => {
      const assigned = res[name as keyof RequireWeakResT<T>];
      if (assigned) (res[name as keyof RequireWeakResT<T>] as unknown) = value;
      else if (assigned !== value) {
        throw Error('Conflict between default and named exports');
      }
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

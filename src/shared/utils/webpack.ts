import type PathNS from 'node:path';

import { IS_CLIENT_SIDE } from './isomorphy';

type RequireWeakOptionsT = {
  basePath?: string;
};

type RequireWeakResT<T> = T extends { default: infer D }
  ? (D extends null | undefined ? T : D & Omit<T, 'default'>)
  : T;

/**
 * Requires the specified module without including it into the bundle during
 * Webpack build.
 * @param modulePath
 * @param [basePath]
 * @return Required module.
 */
export function requireWeak<T extends object>(
  modulePath: string,

  // TODO: For now `basePath` can be provided directly as a string here,
  // for backward compatibility. Deprecate it in future, if any other
  // breaking changes are done for requireWeak().
  basePathOrOptions?: string | RequireWeakOptionsT,
): RequireWeakResT<T> | null {
  if (IS_CLIENT_SIDE) return null;

  let basePath: string | undefined;
  let ops: RequireWeakOptionsT;
  if (typeof basePathOrOptions === 'string') {
    basePath = basePathOrOptions;
  } else {
    ops = basePathOrOptions ?? {};
    ({ basePath } = ops);
  }

  // eslint-disable-next-line no-eval
  const req = eval('require') as (path: string) => unknown;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { resolve } = req('path') as typeof PathNS;

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

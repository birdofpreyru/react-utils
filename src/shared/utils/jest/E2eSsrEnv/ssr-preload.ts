import { existsSync, statSync } from 'node:fs';
import { registerHooks } from 'node:module';

const TRIAL = [
  '',
  '.cjs',
  '.js',
  '.jsx',
  '.mjs',
  '.ts',
  '.tsx',
];

registerHooks({
  resolve: (specifier, context, next) => {
    let path = specifier;

    // This works around the regular ESM limitation of having to have explicit
    // file extensions on import specifiers.
    if ((
      specifier.startsWith('.') || specifier.startsWith('/')
    ) && context.conditions.includes('import')) {
      const url = new URL(specifier, context.parentURL);
      path = url.pathname;

      if (existsSync(path) && statSync(path).isDirectory()) path += '/index';

      for (const ext of TRIAL) {
        if (existsSync(path + ext)) {
          path += ext;
          break;
        }
      }
    }

    return next(path, context);
  },
});

// eslint-disable-next-line import/dynamic-import-chunkname
void import('./ssr');

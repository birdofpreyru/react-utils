import { existsSync, readFileSync, statSync } from 'node:fs';
import { type LoadFnOutput, createRequire, registerHooks } from 'node:module';
import { basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type * as BabelCore from '@babel/core';

const CANDIDATE_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
];

const require = createRequire(import.meta.url);

type RegisterBabelLoaderArgT = {
  envName?: string;
  root?: string;
};

/**
 * It looks like, as of Babel v8, @babel/node does not quite work with ES module
 * codebase. This function registers a Node module API hook that customizes ES
 * module loading, to run Babel transformation on them.
 *{(
 * BEWARE: It is intended for development environments only.
 */
export function registerBabelLoader({
  envName = 'development',
  root = process.cwd(),
}: RegisterBabelLoaderArgT = {}): void {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { transformSync } = require('@babel/core') as typeof BabelCore;

  const cache = new Map<string, LoadFnOutput>();

  registerHooks({
    load(url, context, next) {
      const cached = cache.get(url);
      if (cached !== undefined) return cached;

      if (
        url.startsWith('file://')
        && !url.includes('/node_modules/')
        && !url.includes('/config/babel/')
        && url.match(/.(js|jsx|svg|ts|tsx)$/)
      ) {
        const path = fileURLToPath(url);
        const source = readFileSync(path, 'utf8');

        const transformed = transformSync(source, {
          cwd: dirname(path),
          envName,
          filename: basename(path),
          root,
        });

        const res: LoadFnOutput = {
          format: 'module',
          shortCircuit: true,
          source: transformed?.code ?? '',
        };

        cache.set(url, res);
        return res;
      }

      return next(url, context);
    },
  });
}

/**
 * Registers a Node module API hook that customizes ES module resolution
 * to make mandatory file extensions optional.
 */
export function registerResolver(): void {
  registerHooks({
    resolve(specifier, context, next) {
      let target = specifier;

      if (
        (target.startsWith('.') || target.startsWith('/'))
        && context.conditions.includes('import')
      ) {
        target = new URL(target, context.parentURL).pathname;

        if (existsSync(target) && statSync(target).isDirectory()) {
          target += '/index';
        }

        for (const ext of CANDIDATE_EXTENSIONS) {
          const resolved = target + ext;
          if (existsSync(resolved)) {
            target = resolved;
            break;
          }
        }
      }

      return next(target, context);
    },
  });
}

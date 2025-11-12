/* global document */

import { parse } from 'cookie';

import clientGetInj from '../../client/getInj';

import { IS_CLIENT_SIDE } from './isomorphy/environment-check';
import { requireWeak } from './webpack';

type ConfigT = Record<string, unknown>;

let config: ConfigT | Promise<ConfigT> | undefined;

/**
 * Injects CSRF token into config (on client-side only).
 *
 * BEWARE: It mutates the argument, and also returns it as the result,
 * for chaining.
 */
function injectCsrfToken(cfg: ConfigT): ConfigT {
  // The safeguard for "document" is necessary because in non-Node environments,
  // like React Native, IS_CLIENT_SIDE is "true", however "document" and a bunch
  // of other browser-world features are not available.
  if (IS_CLIENT_SIDE && typeof document !== 'undefined') {
    // eslint-disable-next-line no-param-reassign
    cfg.CSRF = parse(document.cookie).csrfToken;
  }

  return cfg;
}

export function getConfig<T extends ConfigT>(sync: true): T;

export function getConfig<T extends ConfigT>(sync?: boolean): T | Promise<T>;

export function getConfig<T extends ConfigT>(sync?: boolean): T | Promise<T> {
  if (!config) {
    if (IS_CLIENT_SIDE) {
      const inj = clientGetInj();
      config = inj instanceof Promise
        ? inj.then((injection) => {
          const res = injectCsrfToken(injection.CONFIG ?? {});
          config = res;
          return res;
        })
        : injectCsrfToken(inj.CONFIG ?? {});
    } else {
      const weak = requireWeak<ConfigT>('config');
      if (!weak) throw Error('Internal error');
      config = weak;
    }
  }

  if (sync && (config instanceof Promise)) {
    throw Error('The config is not available yet');
  }

  return config as T;
}

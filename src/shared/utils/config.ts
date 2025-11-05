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

export function getConfig(): ConfigT | Promise<ConfigT> {
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

  return config;
}

/**
 * Returns the config object synchronously, if it has been initialized already,
 * or throws an error otherwise. On server side this method is always safe to
 * call; and on the client side it is safe to call within components (as the
 * frontend client initialization sequence guarantees that the async injections
 * the config initialization depends upon are resolved before anything is
 * rendered).
 */
export function getConfigSync(): ConfigT {
  const res = getConfig();

  if (res instanceof Promise) {
    throw Error('Config has not been initialized yet.');
  }

  return res;
}

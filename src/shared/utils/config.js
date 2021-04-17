/**
 * @category Utilities
 * @module config
 * @desc
 * ```js
 * import { config } from '@dr.pogodin/react-utils';
 * ```
 * This module provides isomorphic application configuration, based on
 * [**node-config**](https://github.com/lorenwest/node-config) library.
 * At the server-side it works just as `config` library import,
 * at the client it is made available in the same format via
 * injection into HTML template during the server-side rendering.
 *
 * There are two nuances when imported at the client side:
 * - Any configurations under `SECRET` key at the top level of config won't
 *   be present (they are automatically stripped out by the server-side
 *   renderer, thus providing a configuration segment where server-side
 *   only secrets may be added).
 * - Some extra fields are added to the config by **react-utils** library
 *   itself, to facilitate some other functionalities.
 */
/* global window */

import { IS_CLIENT_SIDE } from './isomorphy';
import { requireWeak } from './webpack';

/* eslint-disable global-require */
export default IS_CLIENT_SIDE ? window.CONFIG : requireWeak('config');
/* eslint-enable global-require */

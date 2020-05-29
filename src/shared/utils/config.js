/**
 * This module provides isomorphic configuration. At the client-side it serves
 * cofiguration object from the global CONFIG variable, injected into the page
 * during the server-side rendering; at the server side it is fetched directly
 * from node-config.
 */

/* global window */

import { IS_CLIENT_SIDE } from './isomorphy';
import { requireWeak } from './webpack';

/* eslint-disable global-require */
export default IS_CLIENT_SIDE ? window.CONFIG : requireWeak('config');
/* eslint-enable global-require */

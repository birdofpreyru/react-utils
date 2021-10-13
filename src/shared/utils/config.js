/* global window */

import { IS_CLIENT_SIDE } from './isomorphy';
import { requireWeak } from './webpack';

/* eslint-disable global-require */
export default IS_CLIENT_SIDE ? window.CONFIG : requireWeak('config');
/* eslint-enable global-require */

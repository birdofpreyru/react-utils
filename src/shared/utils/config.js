/* global window */

import { requireWeak } from './webpack';

/* eslint-disable global-require */
export default requireWeak('config') || window.CONFIG;
/* eslint-enable global-require */

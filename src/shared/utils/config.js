/* global document */

import { IS_CLIENT_SIDE } from './isomorphy/environment-check';
import { requireWeak } from './webpack';

const config = (
  IS_CLIENT_SIDE
    // eslint-disable-next-line global-require
    ? require('client/getInj').default().CONFIG
    : requireWeak('config')
) || {};

if (IS_CLIENT_SIDE) {
  const cookie = require('cookie'); // eslint-disable-line global-require
  config.CSRF = cookie.parse(document.cookie).csrfToken;
}

export default config;

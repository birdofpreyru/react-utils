/* global document */

import { IS_CLIENT_SIDE } from './isomorphy/environment-check';
import { requireWeak } from './webpack';

const config = (
  IS_CLIENT_SIDE
    // eslint-disable-next-line global-require
    ? require('client/getInj').default().CONFIG
    : requireWeak('config')
) || {};

// The safeguard for "document" is necessary because in non-Node environments,
// like React Native, IS_CLIENT_SIDE is "true", however "document" and a bunch
// of other browser-world features are not available.
if (IS_CLIENT_SIDE && typeof document !== 'undefined') {
  const cookie = require('cookie'); // eslint-disable-line global-require
  config.CSRF = cookie.parse(document.cookie).csrfToken;
}

export default config;

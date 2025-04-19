/* global document */

import type CookieM from 'cookie';

import { IS_CLIENT_SIDE } from './isomorphy/environment-check';
import { requireWeak } from './webpack';

// TODO: The internal type casting is somewhat messed up here,
// to be corrected later.
const config: Record<string, unknown> = (
  IS_CLIENT_SIDE
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ? (require('client/getInj') as {
      default: () => Record<string, unknown>;
    }).default().CONFIG
    : requireWeak('config')
) as (Record<string, unknown> | undefined) ?? ({} as Record<string, unknown>);

// The safeguard for "document" is necessary because in non-Node environments,
// like React Native, IS_CLIENT_SIDE is "true", however "document" and a bunch
// of other browser-world features are not available.
if (IS_CLIENT_SIDE && typeof document !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cookie = require('cookie') as typeof CookieM;
  config.CSRF = cookie.parse(document.cookie).csrfToken;
}

export default config;

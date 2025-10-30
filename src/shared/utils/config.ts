/* global document */

import { parse } from 'cookie';

import clientGetInj from '../../client/getInj';

import { IS_CLIENT_SIDE } from './isomorphy/environment-check';
import { requireWeak } from './webpack';

// TODO: The internal type casting is somewhat messed up here,
// to be corrected later.
const config: Record<string, unknown> = (
  IS_CLIENT_SIDE ? clientGetInj().CONFIG : requireWeak('config')
) as (Record<string, unknown> | undefined) ?? ({} as Record<string, unknown>);

// The safeguard for "document" is necessary because in non-Node environments,
// like React Native, IS_CLIENT_SIDE is "true", however "document" and a bunch
// of other browser-world features are not available.
if (IS_CLIENT_SIDE && typeof document !== 'undefined') {
  config.CSRF = parse(document.cookie).csrfToken;
}

export default config;

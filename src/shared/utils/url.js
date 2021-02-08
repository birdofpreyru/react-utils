/**
 * URL utils.
 */

import { trimEnd } from 'lodash';

/**
 * Given URL string returns the parent URL.
 * @param {String} url
 * @return {String}
 */
export function parent(path) {
  return path.slice(0, trimEnd(path, '/').lastIndexOf('/'));
}

export default null;

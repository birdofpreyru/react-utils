/**
 * URL utils.
 */

import _ from 'lodash';

/**
 * Given URL string returns the parent URL.
 * @param {String} url
 * @return {String}
 */
export function parent(path) {
  return path.slice(0, _.trimEnd(path, '/').lastIndexOf('/'));
}

export default null;

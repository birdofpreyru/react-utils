import 'styles/global.scss';

import { isomorphy, webpack } from 'utils';

let server = null; // eslint-disable-line import/no-mutable-exports
if (isomorphy.IS_SERVER_SIDE) {
  const path = webpack.requireWeak('path');
  server = webpack.requireWeak(path.resolve(__dirname, './server'));
}

/**
 * @category Utilities
 * @module _
 * @desc
 * ```js
 * import { _ } from '@dr.pogodin/react-utils';
 * ```
 * `_` is just an alias for [lodash](https://lodash.com/docs) library,
 * which provides various generic JS helpers.
 */
export { default as _ } from 'lodash';

/**
 * @category Utilities
 * @module api
 * @desc
 * ```js
 * import { api } from '@dr.pogodin/react-utils';
 * ```
 * `api` is just an alias for [`axios`](https://www.npmjs.com/package/axios)
 * library, which provides a great HTTP(S) client.
 */
export { default as api } from 'axios';

/**
 * @category Utilities
 * @module PT
 * @desc
 * ```js
 * import { PT } from '@dr.pogodin/react-utils';
 * ```
 * `PT` (short for `prop-types`) is an alias for
 * [prop-types](https://www.npmjs.com/package/prop-types) library,
 * which facilitates runtime type checks for React.
 */
export * as PT from 'prop-types';

export {
  getGlobalState,
  GlobalStateProvider,
  useAsyncCollection,
  useAsyncData,
  useGlobalState,
} from '@dr.pogodin/react-global-state';

export * from 'components';
export * from 'utils';

export { server };

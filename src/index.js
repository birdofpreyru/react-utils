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

/**
 * @category Utilities
 * @module ReactGlobalState
 * @desc
 * ```jsx
 * import {
 *   getGlobalState,
 *   GlobalStateProvider,
 *   useAsyncCollection,
 *   useAsyncData,
 *   useGlobalState,
 * } from '@dr.pogodin/react-utils';
 * ```
 * For convenience, `react-utils` re-exports components and hooks provided by
 * [react-global-state](https://dr.pogodin.studio/docs/react-global-state/index.html)
 * library, which  is a state of the art library for global state and
 * asynchronous data managment in React applications, powered by hooks and
 * Context API. It is simple, efficient, and with a full server-side rendering
 * (SSR) support.
 *
 * The standard {@link client} and {@link server} automatically wrap your
 * app into `<GlobalStateProvider>`, also `server` wires `react-global-state` to
 * SSR setup, and also exposes the actual incoming HTTP request object via SSR
 * context, to which it attaches it as `req` field.
 */

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

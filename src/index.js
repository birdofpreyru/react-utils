import 'styles/global.scss';

import { isomorphy, webpack } from 'utils';

let server = null; // eslint-disable-line import/no-mutable-exports
if (isomorphy.IS_SERVER_SIDE) {
  try {
    const path = webpack.requireWeak('path');
    server = webpack.requireWeak(path.resolve(__dirname, './server'));
  } catch (error) {
    server = null;
  }
}

export { default as api } from 'axios';
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

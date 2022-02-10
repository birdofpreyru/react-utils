import 'styles/global.scss';

import { webpack } from 'utils';

const server = webpack.requireWeak('./server', __dirname);

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

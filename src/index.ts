import 'styles/global.scss';

import { webpack } from 'utils';

import type ServerT from './server';

const server = webpack.requireWeak('./server', __dirname) as (typeof ServerT) | null;

const client = server ? undefined : require('./client').default;

export {
  type AsyncCollectionLoaderT,
  type AsyncDataEnvelopeT,
  type AsyncDataLoaderT,
  type ForceT,
  type UseAsyncDataOptionsT,
  type UseAsyncDataResT,
  type UseGlobalStateResT,
  type ValueOrInitializerT,
  getGlobalState,
  GlobalStateProvider,
  newAsyncDataEnvelope,
  useAsyncCollection,
  useAsyncData,
  useGlobalState,
  withGlobalStateType,
} from '@dr.pogodin/react-global-state';

export * from 'components';

export {
  type Listener,
  type Theme,
  config,
  Barrier,
  Emitter,
  isomorphy,
  getSsrContext,
  Semaphore,
  splitComponent,
  themed,
  ThemeProvider,
  time,
  webpack,
  withRetries,
} from 'utils';

export { client, server };

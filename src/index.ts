import 'styles/global.scss';

import { webpack } from 'utils';

import type ServerFactoryT from './server';

const server = webpack.requireWeak('./server', __dirname) as (typeof ServerFactoryT) | null;

const client = server ? undefined : require('./client').default;

export {
  type AsyncCollectionT,
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
  type BeforeRenderResT,
  type BeforeRenderT,
  type ConfigT,
  type ServerT,
} from './server';

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

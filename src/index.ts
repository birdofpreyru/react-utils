import 'styles/global.scss';

import { webpack } from 'utils';

import type * as ClientM from './client';
import type * as ServerFactoryM from './server';

const server = webpack.requireWeak<typeof ServerFactoryM>('./server', __dirname);

const client = server
  ? undefined

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  : (require('./client') as typeof ClientM).default;

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
  type ServerSsrContext,
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

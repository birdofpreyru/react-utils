import 'styles/global.scss';

import clientModule from './client';
import { webpack } from './shared/utils';

import type * as ServerFactoryM from './server';

// It is a safeguard against multiple instances / versions of the library
// being loaded into environment by mistake (e.g. because of different
// packages pinning down different exact versions of the lib, thus preventing
// a proper dedupe and using a single common library version).
if (global.REACT_UTILS_LIBRARY_LOADED) {
  throw Error('React utils library is already loaded');
} else global.REACT_UTILS_LIBRARY_LOADED = true;

// TODO: This is a rapid workaround to get rid of __dirname. I guess, later
// we'll re-implement requireWeak() to accept import.meta.url directly, and
// this workaround won't be needed.
let dirname = import.meta.url;
dirname = dirname.slice(5, dirname.lastIndexOf('/'));

const server = webpack.requireWeak<typeof ServerFactoryM>('./server', dirname);

const client = server ? undefined : clientModule;

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
  assertEmptyObject,
  Barrier,
  Cached,
  Emitter,
  getConfig,
  getConfigSync,
  isomorphy,
  getSsrContext,
  type Listener,
  type ObjectKey,
  Semaphore,
  splitComponent,
  type Theme,
  themed,
  ThemeProvider,
  time,
  webpack,
  withRetries,
} from 'utils';

export { client, server };

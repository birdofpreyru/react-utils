import 'styles/global.scss';

// It is a safeguard against multiple instances / versions of the library
// being loaded into environment by mistake (e.g. because of different
// packages pinning down different exact versions of the lib, thus preventing
// a proper dedupe and using a single common library version).
if (global.REACT_UTILS_LIBRARY_LOADED) {
  throw Error('React utils library is already loaded');
} else global.REACT_UTILS_LIBRARY_LOADED = true;

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

// TODO: For now I commented out this safeguard check, as I am not sure how
// to easily make it work: it should not be triggered in HMR mode, but if I
// add the code relying on import.meta, it fails in Jest environment, because
// Jest does not support ES modules yet, and import.meta is not support in
// CommonJS modules, and the "babel-plugin-transform-import-meta" plugin
// we use to workaround this issue for import.meta.dirname, etc. does not
// transform import.meta.webpackHot

// It is a safeguard against multiple instances / versions of the library
// being loaded into environment by mistake (e.g. because of different
// packages pinning down different exact versions of the lib, thus preventing
// a proper dedupe and using a single common library version).
// if (global.REACT_UTILS_LIBRARY_LOADED) {
//  throw Error('React utils library is already loaded');
// } else global.REACT_UTILS_LIBRARY_LOADED = true;

/*
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ImportMeta {
    webpackHot?: {
      dispose(cb: () => void): void;
    };
  }
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {
    delete global.REACT_UTILS_LIBRARY_LOADED;
  });
}
*/

export {
  type AsyncCollectionLoaderT,
  type AsyncCollectionT,
  type AsyncDataEnvelopeT,
  type AsyncDataLoaderT,
  type ForceT,
  GlobalStateProvider,
  type UseAsyncDataOptionsT,
  type UseAsyncDataResT,
  type UseGlobalStateResT,
  type ValueOrInitializerT,
  getGlobalState,
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
  Barrier,
  Cached,
  Emitter,
  type Listener,
  type ObjectKey,
  Semaphore,
  THEME_COMPOSE,
  THEME_PRIORITY,
  type Theme,
  ThemeProvider,
  assertEmptyObject,
  getConfig,
  getSsrContext,
  isomorphy,
  splitComponent,
  time,
  useTheme,
  webpack,
  withRetries,
} from 'utils';

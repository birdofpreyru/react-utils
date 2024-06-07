import 'styles/global.scss';

import { webpack } from 'utils';

import type ServerT from './server';

const server = webpack.requireWeak('./server', __dirname) as (typeof ServerT) | null;

// TODO: Should be done in a cleaner way, but technically it is fine
// for this scenario.
// eslint-disable-next-line import/no-mutable-exports
let client = server ? undefined : require('./client');

if (client) {
  client.default.setInj = client.setInj;
  client = client.default;
}

export { default as api } from 'axios';
export * as PT from 'prop-types';

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

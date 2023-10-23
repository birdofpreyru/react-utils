import 'styles/global.scss';

import { webpack } from 'utils';

import type ServerT from './server';

const server = webpack.requireWeak('./server', __dirname) as (typeof ServerT) | null;

const client = server ? undefined : require('./client').default;

export { default as api } from 'axios';
export * as PT from 'prop-types';

export {
  default as Rgs,
  type API as RgsApi,
  getGlobalState,
  GlobalStateProvider,
  useAsyncCollection,
  useAsyncData,
  useGlobalState,
} from '@dr.pogodin/react-global-state';

export {
  BaseModal,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Link,
  PageLayout,
  MetaTags,
  Modal,
  NavLink,
  ScalableRect,
  Throbber,
  WithTooltip,
  YouTubeVideo,
} from 'components';

export {
  type Theme,
  config,
  Barrier,
  Emitter,
  isomorphy,
  getSsrContext,
  JU,
  Semaphore,
  splitComponent,
  themed,
  ThemeProvider,
  time,
  webpack,
  withRetries,
} from 'utils';

export { client, server };

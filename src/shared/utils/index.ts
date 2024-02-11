import themedImpl, {
  type Theme,
  COMPOSE,
  PRIORITY,
  ThemeProvider,
} from '@dr.pogodin/react-themes';

import config from './config';
import * as isomorphy from './isomorphy';
import time from './time';
import * as webpack from './webpack';

import type * as JuT from './jest';

export {
  Barrier,
  Emitter,
  Semaphore,
  withRetries,
} from '@dr.pogodin/js-utils';

export { getSsrContext } from './globalState';
export { default as splitComponent } from './splitComponent';

type ThemedT = typeof themedImpl & {
  COMPOSE: typeof COMPOSE;
  PRIORITY: typeof PRIORITY;
};

const themed: ThemedT = themedImpl as ThemedT;

themed.COMPOSE = COMPOSE;
themed.PRIORITY = PRIORITY;

// Note: it should be done this way, as in some environments
// "process" might not exist, and process.env.NODE_CONFIG_ENV
// not injected by Webpack.
let NODE_CONFIG_ENV;
try {
  NODE_CONFIG_ENV = process.env.NODE_CONFIG_ENV;
} catch { /* noop */ }

const env = NODE_CONFIG_ENV || process.env.NODE_ENV;

const JU: typeof JuT | null = env !== 'production'
  ? webpack.requireWeak('./jest', __dirname) as typeof JuT | null
  : null;

export {
  type Theme,
  config,
  isomorphy,
  JU,
  themed,
  ThemeProvider,
  time,
  webpack,
};

import themedImpl, {
  COMPOSE,
  PRIORITY,
  type Theme,
  ThemeProvider,
} from '@dr.pogodin/react-themes';

import config from './config';
import * as isomorphy from './isomorphy';
import time from './time';
import * as webpack from './webpack';

export {
  type Listener,
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

export {
  type Theme,
  config,
  isomorphy,
  themed,
  ThemeProvider,
  time,
  webpack,
};

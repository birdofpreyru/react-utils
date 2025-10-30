/* global process */

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// NOTE: For some environments this manner to import works better than
// require(`./build/${env}`).
export default process.env.NODE_ENV === 'production'
  ? require('./build/production') : require('./build/development');

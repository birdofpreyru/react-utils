/**
 * Initialization of client-side environment.
 */

/* global window */

import { type BuildInfoT, getBuildInfo } from 'utils/isomorphy/buildInfo';

const buildInfo = getBuildInfo();

// TODO: Should be moved into buildInfo module?
declare global {
  interface Window {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
    __DEV_BUILD_INFO__: BuildInfoT | undefined;
  }
}

declare const BUILD_INFO: BuildInfoT | undefined;

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.warn('Dev mode: "BUILD_INFO" attached to the global "window"');
  // eslint-disable-next-line no-underscore-dangle
  window.__DEV_BUILD_INFO__ = BUILD_INFO;
}

/* TODO: A proper logger should be moved to `@dr.pogodin/react-utils`. */
/* eslint-disable no-console */
const { useServiceWorker } = buildInfo;
if (useServiceWorker) {
  const { navigator } = window;
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // Note: no matter the "publicPath", we want to serve the service worker
        // from the web app root, to allow it control any and all pages of the
        // web app (otherwise, it will be restricted to the scope of its path).
        // The server takes it into account.
        const reg = await navigator
          .serviceWorker.register('/__service-worker.js');
        console.log('SW registered:', reg);
      } catch (err) {
        console.log('SW registration failed:', err);
      }
    });
  }
}
/* eslint-enable no-console */

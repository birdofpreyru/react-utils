/**
 * Initialization of client-side environment.
 */

/* global window */

import { getBuildInfo } from 'utils/isomorphy/buildInfo';

const buildInfo = getBuildInfo();

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

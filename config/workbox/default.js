/**
 * Default Workbox config.
 */

/* global self, workbox */

workbox.core.skipWaiting();
workbox.core.clientsClaim();

/* eslint-disable no-restricted-globals, no-underscore-dangle */
workbox.precaching.precacheAndRoute(self.__precacheManifest);
/* eslint-enable no-restricted-globals, no-underscore-dangle */

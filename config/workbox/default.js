/**
 * Default Workbox config.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
/* eslint-enable import/no-extraneous-dependencies */

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

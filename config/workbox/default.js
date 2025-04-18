/**
 * Default Workbox config.
 */

/* global self */

/* eslint-disable import/no-extraneous-dependencies */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
/* eslint-enable import/no-extraneous-dependencies */

self.skipWaiting();
clientsClaim();

// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);

/**
 * Default Workbox config.
 */
/* global self */

// This is to whitelist self usage beloew.
/* eslint-disable no-restricted-globals */

/* eslint-disable import/no-extraneous-dependencies */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
/* eslint-enable import/no-extraneous-dependencies */

self.skipWaiting();
clientsClaim();

/* eslint-disable no-underscore-dangle */
precacheAndRoute(self.__WB_MANIFEST);
/* eslint-enable no-underscore-dangle */

/**
 * Default Workbox config.
 */
/* global self */
/* eslint-disable import/no-extraneous-dependencies */
import { clientsClaim, skipWaiting } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
/* eslint-enable import/no-extraneous-dependencies */

skipWaiting();
clientsClaim();

/* eslint-disable no-restricted-globals, no-underscore-dangle */
precacheAndRoute(self.__WB_MANIFEST);
/* eslint-enable no-restricted-globals, no-underscore-dangle */

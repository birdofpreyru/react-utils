/**
 * A simple wrapper for "event-source-polyfill", to install the polyfill
 * when this script is executed.
 *
 * IMPORTANT: This is intended for the dev mode only.
 */
/* global window */
/* eslint-disable global-require, import/no-extraneous-dependencies */

if (typeof EventSource === 'undefined') {
  window.EventSource = require('event-source-polyfill').EventSourcePolyfill;
}

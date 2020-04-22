/**
 * A simple wrapper for "event-source-polyfill", to install the polyfill
 * when this script is executed.
 */

if (typeof EventSource === 'undefined') {
  window.EventSource = require('event-source-polyfill').EventSourcePolyfill;
}

/**
 * Initialization of client-side environment.
 */

/* global BUILD_INFO, document, window */

import cookie from 'cookie';

// Note: this way, only required part of "node-forge": AES, and some utils,
// is bundled into client-side code.
import forge from 'node-forge/lib/forge';
import 'node-forge/lib/aes';

/* `BUILD_INFO` is always injected by Webpack build, but this check is needed
 * to adopt the code for usage in tests. */
if (typeof BUILD_INFO !== 'undefined') {
  window.TRU_BUILD_INFO = BUILD_INFO;
}

/* Removes data injection script out of the document.
 * The if block is here for test purposes. */
if (!window.TRU_KEEP_INJ_SCRIPT) {
  const block = document.querySelector('script[id="inj"]');
  if (block) document.getElementsByTagName('body')[0].removeChild(block);
}

/* TODO: A proper logger should be moved to `@dr.pogodin/react-utils`. */
/* eslint-disable no-console */
const { useServiceWorker } = window.TRU_BUILD_INFO;
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

/* Decodes data injected at the server side. */
if (window.INJ) {
  const { key } = window.TRU_BUILD_INFO;
  let data = forge.util.decode64(window.INJ);
  const decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({ iv: data.slice(0, 32) });
  decipher.update(forge.util.createBuffer(data.slice(32)));
  decipher.finish();

  data = forge.util.decodeUtf8(decipher.output.data);
  data = eval(`(${data})`); // eslint-disable-line no-eval

  window.CHUNK_GROUPS = data.CHUNK_GROUPS;
  window.CONFIG = data.CONFIG;
  window.ISTATE = data.ISTATE;
} else {
  // This is possible when the client-side bundle is launched as a stand-alone
  // precompiled website, rather than served by react-utils' based server.
  window.CHUNK_GROUPS = {};
  window.CONFIG = {};
}

window.CONFIG.CSRF = cookie.parse(document.cookie).csrfToken;

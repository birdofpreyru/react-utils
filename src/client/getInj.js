// Encapsulates retrieval of server-side data injection into HTML template.

/* global document */

// Note: this way, only required part of "node-forge": AES, and some utils,
// is bundled into client-side code.
import forge from 'node-forge/lib/forge';
import 'node-forge/lib/aes';

import { getBuildInfo } from 'utils/isomorphy/buildInfo';

// Safeguard is needed here, because the server-side version of Docusaurus docs
// is compiled (at least now) with settings suggesting it is a client-side
// environment, but there is no document.
let inj = typeof document !== 'undefined'
  && document.querySelector('meta[itemprop="drpruinj"]');

if (inj) {
  inj.remove();
  const { key } = getBuildInfo();
  inj = forge.util.decode64(inj.content);
  const d = forge.cipher.createDecipher('AES-CBC', key);
  d.start({ iv: inj.slice(0, key.length) });
  d.update(forge.util.createBuffer(inj.slice(key.length)));
  d.finish();
  inj = forge.util.decodeUtf8(d.output.data);
  inj = eval(`(${inj})`); // eslint-disable-line no-eval
} else {
  // Otherwise, a bunch of dependent stuff will easily fail in non-standard
  // environments, where no client-side initialization is performed. Like tests,
  // Docusaurus examples, etc.
  inj = {};
}

export default function getInj() {
  return inj;
}

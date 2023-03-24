// Encapsulates retrieval of server-side data injection into HTML template.

/* global document */

// Note: this way, only required part of "node-forge": AES, and some utils,
// is bundled into client-side code.
import forge from 'node-forge/lib/forge';
import 'node-forge/lib/aes';

import { getBuildInfo } from 'utils/isomorphy/buildInfo';

let inj = document.querySelector('meta[itemprop="drpruinj"]');

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
}

export default function getInj() {
  return inj;
}

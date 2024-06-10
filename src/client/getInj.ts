// Encapsulates retrieval of server-side data injection into HTML template.

/* global document */

// Note: this way, only required part of "node-forge": AES, and some utils,
// is bundled into client-side code.
import forge from 'node-forge/lib/forge';
import 'node-forge/lib/aes';

import type { InjT } from 'utils/globalState';

import { getBuildInfo } from 'utils/isomorphy/buildInfo';

// Safeguard is needed here, because the server-side version of Docusaurus docs
// is compiled (at least now) with settings suggesting it is a client-side
// environment, but there is no document.
let inj: InjT = {};

const metaElement: HTMLMetaElement | null = typeof document !== 'undefined'
  ? document.querySelector('meta[itemprop="drpruinj"]') : null;

if (metaElement) {
  metaElement.remove();
  let data = forge.util.decode64(metaElement.content);

  const { key } = getBuildInfo();
  const d = forge.cipher.createDecipher('AES-CBC', key);
  d.start({ iv: data.slice(0, key.length) });
  d.update(forge.util.createBuffer(data.slice(key.length)));
  d.finish();

  data = forge.util.decodeUtf8(d.output.data);
  inj = eval(`(${data})`); // eslint-disable-line no-eval
} else if (window.REACT_UTILS_INJECTION) {
  inj = window.REACT_UTILS_INJECTION;
  delete window.REACT_UTILS_INJECTION;
} else {
  // Otherwise, a bunch of dependent stuff will easily fail in non-standard
  // environments, where no client-side initialization is performed. Like tests,
  // Docusaurus examples, etc.
  inj = {};
}

export default function getInj(): InjT {
  return inj;
}

// Encapsulates retrieval of server-side data injection into HTML template.

/* global document */

// Note: this way, only required part of "node-forge": AES, and some utils,
// is bundled into client-side code.
import forge from 'node-forge/lib/forge.js';

// eslint-disable-next-line import/no-unassigned-import
import 'node-forge/lib/aes.js';

import type { InjT } from 'utils/globalState';

import { getBuildInfo } from 'utils/isomorphy/buildInfo';

// Safeguard is needed here, because the server-side version of Docusaurus docs
// is compiled (at least now) with settings suggesting it is a client-side
// environment, but there is no document.
let inj: InjT = {};

const metaElement: HTMLMetaElement | null = typeof document === 'undefined'
  ? null : document.querySelector('meta[itemprop="drpruinj"]');

if (metaElement) {
  metaElement.remove();
  let data = forge.util.decode64(metaElement.content);

  const { key } = getBuildInfo();
  const d = forge.cipher.createDecipher('AES-CBC', key);
  d.start({ iv: data.slice(0, key.length) });
  d.update(forge.util.createBuffer(data.slice(key.length)));
  d.finish();

  data = forge.util.decodeUtf8(d.output.data);

  // TODO: Double-check, if there is a safer alternative to parse it?
  // eslint-disable-next-line no-eval
  inj = eval(`(${data})`) as InjT;
} else if (typeof window !== 'undefined' && window.REACT_UTILS_INJECTION) {
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

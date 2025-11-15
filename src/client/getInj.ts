// Encapsulates retrieval of server-side data injection into HTML template.

/* global document */

import type { InjT } from 'utils/globalState';

import { getBuildInfo } from 'utils/isomorphy/buildInfo';

let inj: InjT | Promise<InjT> | undefined;

export default function getInj(): InjT | Promise<InjT> {
  inj ??= (async () => {
    const metaElement: HTMLMetaElement | null = typeof document === 'undefined'
      ? null : document.querySelector('meta[itemprop="drpruinj"]');

    if (metaElement) {
      metaElement.remove();

      // NOTE: Since 2025 there is Uint8Array.fromBase64(), which should be
      // preferred, but it is not supported by older environments yet.
      const data = atob(metaElement.content);

      if (!window.isSecureContext) {
        if (window.location.protocol === 'https:') {
          throw Error('Loaded via HTTPS, but it is not considered a secure context');
        } else if (window.location.protocol !== 'http:') {
          throw Error('Unexpected protocol');
        }

        const target = window.location.href.replace(/^http:/, 'https:');
        window.location.replace(target);
      }

      const { key } = getBuildInfo();

      const code = (x: string) => x.charCodeAt(0);
      const dataBuffer = Uint8Array.from(data.slice(16), code);
      const ivBuffer = Uint8Array.from(data.slice(0, 16), code);
      const keyBuffer = Uint8Array.from(atob(key), code);

      const cKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-CBC' },
        false,
        ['decrypt'],
      );

      const buffer = await window.crypto.subtle.decrypt({
        iv: ivBuffer,
        name: 'AES-CBC',
      }, cKey, dataBuffer);

      const decoder = new TextDecoder();

      // eslint-disable-next-line no-eval
      const res = eval(`(${decoder.decode(buffer)})`) as InjT;

      // NOTE: This is important, to be able to return the injection
      // synchronously once it is initialized.
      inj = res;

      return res;
    } else if (typeof window !== 'undefined' && window.REACT_UTILS_INJECTION) {
      const res = window.REACT_UTILS_INJECTION;
      delete window.REACT_UTILS_INJECTION;
      return res;
    }

    // Otherwise, a bunch of dependent stuff will easily fail in non-standard
    // environments, where no client-side initialization is performed. Like tests,
    // Docusaurus examples, etc.
    return {};
  })();

  return inj;
}

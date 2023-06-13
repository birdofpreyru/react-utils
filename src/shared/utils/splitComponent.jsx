/* eslint-disable react/jsx-props-no-spreading */
/* global document */

import PT from 'prop-types';

import {
  forwardRef,
  lazy,
  Suspense,
  useInsertionEffect,
} from 'react';

import { Barrier } from '@dr.pogodin/js-utils';
import { getSsrContext } from '@dr.pogodin/react-global-state';

import {
  IS_CLIENT_SIDE,
  IS_SERVER_SIDE,
  getBuildInfo,
} from 'utils/isomorphy';

// Note: At the client side we can get chunk groups immediately when loading
// the module; at the server-side we only can get them within React render flow.
// Thus, we set and use the following variable at the client-side, and then when
// needed on the server side, we'll fetch it differently.
let clientChunkGroups;
if (IS_CLIENT_SIDE) {
  // eslint-disable-next-line global-require
  clientChunkGroups = require('client/getInj').default().CHUNK_GROUPS || {};
}

const refCounts = {};

function getPublicPath() {
  return getBuildInfo().publicPath;
}

/**
 * Client-side only! Ensures the specified CSS stylesheet is loaded into
 * the document; loads if it is missing; and does simple reference counting
 * to facilitate future clean-up.
 * @param {string} name
 * @param {Set} loadedSheets
 * @param {boolean} refCount
 * @return {Promise}
 */
function bookStyleSheet(name, loadedSheets, refCount) {
  let res;
  const path = `${getPublicPath()}/${name}`;
  const fullPath = `${document.location.origin}${path}`;

  if (!loadedSheets.has(fullPath)) {
    let link = document.querySelector(`link[href="${path}"]`);

    if (!link) {
      link = document.head.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', path);
      document.head.appendChild(link);
    }

    res = new Barrier();
    link.addEventListener('load', res.resolve);
    link.addEventListener('error', res.resolve);
  }

  if (refCount) {
    const current = refCounts[path] || 0;
    refCounts[path] = 1 + current;
  }

  return res;
}

/**
 * Generates the set of URLs for currently loaded, linked stylesheets.
 * @return {Set}
 */
function getLoadedStyleSheets() {
  const res = new Set();
  const { styleSheets } = document;
  for (let i = 0; i < styleSheets.length; ++i) {
    const { href } = styleSheets[i];
    if (href) res.add(href);
  }
  return res;
}

function assertChunkName(chunkName, chunkGroups) {
  if (chunkGroups[chunkName]) return;
  throw Error(`Unknown chunk name "${chunkName}"`);
}

/**
 * Client-side only! Ensures all CSS stylesheets required for the specified
 * code chunk are loaded into the document; loads the missing ones; and does
 * simple reference counting to facilitate future clean-up.
 * @param {string} chunkName Chunk name.
 * @param {boolean} refCount
 * @return {Promise} Resolves once all pending stylesheets, necessary for
 *  the chunk, are either loaded, or failed to load.
 */
export function bookStyleSheets(chunkName, chunkGroups, refCount) {
  const promises = [];
  const assets = chunkGroups[chunkName];
  const loadedSheets = getLoadedStyleSheets();

  for (let i = 0; i < assets.length; ++i) {
    const asset = assets[i];
    if (asset.endsWith('.css')) {
      const promise = bookStyleSheet(asset, loadedSheets, refCount);
      if (promise) promises.push(promise);
    }
  }

  return promises.length ? Promise.allSettled(promises) : Promise.resolve();
}

/**
 * Client-side only! Frees from the document all CSS stylesheets that are
 * required by the specified chunk, and have reference counter equal to one
 * (for chunks with larger reference counter values, it just decrements
 * the reference counter).
 * @param {string} chunkName
 */
export function freeStyleSheets(chunkName, chunkGroups) {
  const assets = chunkGroups[chunkName];
  for (let i = 0; i < assets.length; ++i) {
    const asset = assets[i];
    if (asset.endsWith('.css')) {
      const path = `${getPublicPath()}/${asset}`;
      if (--refCounts[path] <= 0) {
        document.head.querySelector(`link[href="${path}"]`).remove();
      }
    }
  }
}

// Holds the set of chunk names already used for splitComponent() calls.
const usedChunkNames = new Set();

/**
 * Given an async component retrieval function `getComponent()` it creates
 * a special "code split" component, which uses <Suspense> to asynchronously
 * load on demand the code required by `getComponent()`.
 * @param {object} options
 * @param {string} options.chunkName
 * @param {function} options.getComponent
 * @param {React.Element} [options.placeholder]
 * @return {React.ElementType}
 */
export default function splitComponent({
  chunkName,
  getComponent,
  placeholder,
}) {
  // On the client side we can check right away if the chunk name is known.
  if (IS_CLIENT_SIDE) assertChunkName(chunkName, clientChunkGroups);

  // The correct usage of splitComponent() assumes a single call per chunk.
  if (usedChunkNames.has(chunkName)) {
    throw Error(`Repeated splitComponent() call for the chunk "${chunkName}"`);
  } else usedChunkNames.add(chunkName);

  const LazyComponent = lazy(async () => {
    let Component = await getComponent();
    if (Component.default) Component = Component.default;

    // This pre-loads necessary stylesheets prior to the first mount of
    // the component (the lazy load function is executed by React one at
    // the frist mount).
    if (IS_CLIENT_SIDE) {
      await bookStyleSheets(chunkName, clientChunkGroups, false);
    }

    const Wrapper = forwardRef(({ children, ...rest }, ref) => {
      // On the server side we'll assert the chunk name here,
      // and also push it to the SSR chunks array.
      if (IS_SERVER_SIDE) {
        const { chunkGroups, chunks } = getSsrContext();
        assertChunkName(chunkName, chunkGroups);
        if (!chunks.includes(chunkName)) chunks.push(chunkName);
      }

      // This takes care about stylesheets management every time an instance of
      // this component is mounted / unmounted.
      useInsertionEffect(() => {
        bookStyleSheets(chunkName, clientChunkGroups, true);
        return () => freeStyleSheets(chunkName, clientChunkGroups);
      }, []);

      return <Component ref={ref} {...rest}>{children}</Component>;
    });

    Wrapper.propTypes = {
      children: PT.node,
    };

    Wrapper.defaultProps = {
      children: undefined,
    };

    return { default: Wrapper };
  });

  function CodeSplit({ children, ...rest }) {
    return (
      <Suspense fallback={placeholder}>
        <LazyComponent {...rest}>
          {children}
        </LazyComponent>
      </Suspense>
    );
  }

  CodeSplit.propTypes = {
    children: PT.node,
  };

  CodeSplit.defaultProps = {
    children: undefined,
  };

  return CodeSplit;
}

/* eslint-disable react/jsx-props-no-spreading */
/* global document */

import PT from 'prop-types';
import { lazy, Suspense, useInsertionEffect } from 'react';

import { Barrier } from '@dr.pogodin/js-utils';
import { getSsrContext } from '@dr.pogodin/react-global-state';

import {
  IS_CLIENT_SIDE,
  IS_SERVER_SIDE,
  getBuildInfo,
} from 'utils/isomorphy';

const knownChunkNames = new Set();

let chunkGroups;
let styleSheetRefCounters;
if (IS_CLIENT_SIDE) {
  // eslint-disable-next-line global-require
  chunkGroups = require('client/getInj').default().CHUNK_GROUPS || {};
  styleSheetRefCounters = {};
}

function getPublicPath() {
  return getBuildInfo().publicPath;
}

/**
 * Client-side only! Initiates loading of the specified stylesheet into
 * the document, if it is not already (being) loaded, and returns a promise
 * which resolves once the stylesheet loading has settled (i.e. it has loaded,
 * or failed to load). It also manages a simple reference counting for
 * the stylesheet.
 * @param {string} name
 * @param {boolean} [incrementRefCounter=true]
 * @return {Promise}
 */
function mountStyleSheet(name, incrementRefCounter = true) {
  const res = new Barrier();
  const path = `${getPublicPath()}/${name}`;
  let link = document.querySelector(`link[href="${path}"]`);

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('href', path);
    link.setAttribute('rel', 'stylesheet');
    document.head.appendChild(link);
  }

  if (link.hasAttribute('data-settled')) res.resolve();
  else {
    const onSettled = () => {
      link.setAttribute('data-settled', '');
      link.removeEventListener('load', onSettled);
      link.removeEventListener('error', onSettled);
      res.resolve();
    };
    link.addEventListener('load', onSettled);
    link.addEventListener('error', onSettled);
  }

  if (incrementRefCounter) {
    const count = styleSheetRefCounters[path] || 0;
    styleSheetRefCounters[path] = 1 + count;
  }

  return res;
}

/**
 * Client-side only! Loads into the document CSS stylesheets that are required
 * by the specified chunk, and aren't loaded yet. The loading is triggered by
 * injecting <link> elements into the document header.
 * @param {string} chunkName Chunk name.
 * @param {boolean} [incrementReferenceCounter=true]
 * @return {Promise} Resolves once all pending stylesheets, necessary for
 *  the chunk, are either loaded, or failed to load.
 */
export function mountStyleSheets(chunkName, incrementReferenceCounter = true) {
  const res = [];
  const assets = chunkGroups[chunkName];
  for (let i = 0; i < assets.length; ++i) {
    const asset = assets[i];
    if (asset.endsWith('.css')) {
      res.push(mountStyleSheet(asset, incrementReferenceCounter));
    }
  }
  return Promise.allSettled(res);
}

/**
 * Client-side only! Unloads from the document all CSS stylesheets that are
 * required by the specified chunk, and have reference counter equal to one
 * (for chunks with larger reference counter values, it just decrements
 * the reference counter).
 * @param {string} chunkName
 */
export function unmountStyleSheets(chunkName) {
  const assets = chunkGroups[chunkName];
  for (let i = 0; i < assets.length; ++i) {
    const asset = assets[i];
    if (asset.endsWith('.css')) {
      const path = `${getPublicPath()}/${asset}`;
      if (--styleSheetRefCounters[path] <= 0) {
        document.querySelector(`link[href="${path}"]`).remove();
      }
    }
  }
}

/**
 * Wraps a regular React component into a "code splitting" component,
 * i.e. all code used exclusively by that component and its sub-tree
 * will go into a separate, asynchronously loaded, code chunk for
 * the client-side.
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
  if (knownChunkNames.has(chunkName)) {
    throw Error(`Chunk name clash for "${chunkName}"`);
  } else knownChunkNames.add(chunkName);

  const LazyComponent = lazy(async () => {
    const stylesPromise = IS_CLIENT_SIDE && mountStyleSheets(chunkName, false);

    let Component = await getComponent();
    if (Component.default) Component = Component.default;

    function WrappedComponent({ children, ...props }) {
      useInsertionEffect(() => {
        mountStyleSheets(chunkName);
        return () => unmountStyleSheets(chunkName);
      }, []);

      return <Component {...props}>{children}</Component>;
    }

    WrappedComponent.propTypes = {
      children: PT.node,
    };

    WrappedComponent.defaultProps = {
      children: undefined,
    };

    if (IS_CLIENT_SIDE) await stylesPromise;

    return { default: WrappedComponent };
  });

  function CodeSplit({ children, ...rest }) {
    if (IS_SERVER_SIDE) {
      const { chunks } = getSsrContext();
      if (!chunks.includes(chunkName)) chunks.push(chunkName);
    }
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

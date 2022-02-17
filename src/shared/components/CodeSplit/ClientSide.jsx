/**
 * Client-side implementation of a split code chunk.
 */
/* global document, window */
/* eslint-disable react/jsx-props-no-spreading */

import { useEffect, useRef, useState } from 'react';

import { useAsyncData } from '@dr.pogodin/react-global-state';

import { newBarrier } from 'utils/Barrier';
import { getBuildInfo } from 'utils/isomorphy';
import time from 'utils/time';

export default function ClientSide({
  chunkName,
  children,
  getClientSide,
  placeholder,

  // Not used in <ClientSide>, but should not go into "...rest" either.
  serverSide,

  ...rest
}) {
  const { current: heap } = useRef({
    mounted: false,
    pendingStyles: [],
    renderInitialized: false,
  });

  // publicPath from buildInfo does not have a trailing slash at the end.
  const { publicPath } = getBuildInfo();

  // This code block initiates style loading as soon as possible, even prior to
  // the component code loading. Style load promises are collected into
  // heap.pendingStyles array, allowing us to wait until all styles are
  // loaded (or failed to load), before rendering the component.
  // Note: mini-css-extract-plugin would load necessary CSS chunks
  // automatically, but taking the matter in our own hands helps to avoid
  // a flash of style upon the loading. Though, we rely on
  // mini-css-extract-plugin to unmount unnecessary CSS chunks.
  if (!heap.mounted) {
    heap.mounted = true;
    window.CHUNK_GROUPS[chunkName].forEach((asset) => {
      if (!asset.endsWith('.css')) return;
      const path = `${publicPath}/${asset}`;
      let link = document.querySelector(`link[href="${path}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('href', path);
        link.setAttribute('rel', 'stylesheet');

        const barrier = newBarrier();
        link.onload = barrier.resolve;

        // This assumes that better we render the page with some styles missing
        // than fail to render it at all.
        link.onerror = barrier.resolve;

        heap.pendingStyles.push(barrier);

        const head = document.querySelector('head');
        head.appendChild(link);
      }
    });
  }

  // Async loading of React component necessary to render the chunk.
  const { data } = useAsyncData(
    `dr_pogodin_react_utils___split_components.${chunkName}`,
    getClientSide,
    { maxage: time.YEAR_MS },
  );

  const createRender = () => {
    const Scene = data.default || data;
    return (
      <div data-chunk-name={chunkName}>
        <Scene {...rest}>
          {children}
        </Scene>
      </div>
    );
  };

  const [render, setRender] = useState(() => {
    // No need to await anything, we can render the final component right away.
    if (data && !heap.pendingStyles.length) {
      heap.renderInitialized = true;
      return createRender();
    }

    // Try to reuse the markup rendered during SSR.
    const node = document.querySelector(`[data-chunk-name=${chunkName}]`);
    if (node) {
      return (
        <div
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{ __html: node.innerHTML || '' }}
          /* eslint-disable react/no-danger */
          data-chunk-name={chunkName}
        />
      );
    }

    // Else render placeholder, or empty div.
    const Scene = placeholder || (() => null);
    return <div><Scene {...rest}>{children}</Scene></div>;
  });

  // At this point, if we have data, the absense of heap.renderInitialized flag
  // means we have to await styles loading; once it is done, and if we are still
  // mounted, we can set the final render.
  if (data && !heap.renderInitialized) {
    heap.renderInitialized = true;
    Promise.all(heap.pendingStyles).then(() => {
      if (heap.mounted) setRender(createRender());
    });
  }

  useEffect(() => () => {
    heap.mounted = false;
    // No need to remove CSS chunks from DOM, mini-css-extract-plugin injects
    // a code which handles that automatically.
  }, [heap]);

  return render;
}

/**
 * Client-side implementation of a split code chunk.
 */
/* global document, window */
/* eslint-disable react/jsx-props-no-spreading */

import { useEffect, useRef, useState } from 'react';

import { useAsyncData } from '@dr.pogodin/react-global-state';

import { newBarrier } from 'utils';
import { getBuildInfo } from 'utils/isomorphy';
import time from 'utils/time';

export default function ClientSide({
  chunkName,
  getComponentAsync,
  placeholder,
  ...rest
}) {
  const { current: heap } = useRef({
    pendingStyles: [],
    renderInitialized: false,
    stylesInitialized: false,
  });

  // publicPath from buildInfo does not have a trailing slash at the end.
  const { publicPath } = getBuildInfo();

  // This code block initiates style loading as soon as possible; it collects
  // into heap.pendingStyles all style load promises; and heap.stylesInitialized
  // flag remains set until the styles are teared down upon unmounting.
  if (!heap.stylesInitialized) {
    heap.stylesInitialized = true;
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
        heap.pendingStyles.push(barrier);

        const head = document.querySelector('head');
        head.appendChild(link);
      }
      if (!link.dependants) link.dependants = new Set([chunkName]);
      else link.dependants.add(chunkName);
    });
  }

  // Async loading of React component necessary to render the chunk.
  const { data } = useAsyncData(
    `dr_pogodin_react_utils___split_components.${chunkName}`,
    getComponentAsync,
    { maxage: time.YEAR_MS },
  );

  const createRender = () => {
    const Scene = data.default || data;
    return <div data-chunk-name={chunkName}><Scene {...rest} /></div>;
  };

  const [render, setRender] = useState(() => {
    // No need to await anything, we can render the final component right away.
    if (data && !heap.pendingStyles.length) {
      heap.renderInitialized = true;
      return createRender();
    }

    // Otherwse, renders placeholder filled with SSR-genereated HTML,
    // or falls back to empty <div> (if HMR mode corrupted the node).
    /* eslint-disable react/no-danger */
    const node = document.querySelector(`[data-chunk-name=${chunkName}]`) || {};
    return (
      <div
        dangerouslySetInnerHTML={{ __html: node.innerHTML || '' }}
        data-chunk-name={chunkName}
      />
    );
    /* eslint-disable react/no-danger */
  });

  // At this point, if we have data, the absense of heap.renderInitialized flag
  // means we have to await styles loading; once it is done, and if we are still
  // mounted, we can set the final render.
  if (data && !heap.renderInitialized) {
    heap.renderInitialized = true;
    Promise.all(heap.pendingStyles).then(() => {
      if (heap.stylesInitialized) setRender(createRender());
    });
  }

  // This effectively fires only once, just before the component unmounts.
  useEffect(() => () => {
    heap.stylesInitialized = false;
    window.CHUNK_GROUPS[chunkName].forEach((item) => {
      if (!item.endsWith('.css')) return;
      const path = `${publicPath}/${item}`;
      const link = document.querySelector(`link[href="${path}"]`);
      link.dependants.delete(chunkName);
      if (!link.dependants.size) {
        const head = document.querySelector('head');
        head.removeChild(link);
      }
    });
  }, [chunkName, heap, publicPath]);

  return render;
}

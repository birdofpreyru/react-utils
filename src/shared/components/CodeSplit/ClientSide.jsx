/**
 * Client-side implementation of a split code chunk.
 */
/* global document, window */
/* eslint-disable react/jsx-props-no-spreading */

import { useRef, useEffect } from 'react';

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
    mounted: false,
    pendingStyles: [],
  });

  // publicPath from buildInfo does not have a trailing slash at the end.
  const { publicPath } = getBuildInfo();

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
    async (...args) => {
      const res = await getComponentAsync(...args);
      if (heap.pendingStyles.length) await Promise.all(heap.pendingStyles);
      return res;
    },
    { maxage: time.YEAR_MS },
  );

  let res;

  // If the necessary component has been loaded already, it is used to render
  // the chunk.
  if (data) {
    const Scene = data.default || data;
    res = <div data-chunk-name={chunkName}><Scene {...rest} /></div>;

  // Otherwise we just render the same static markup which has been pre-rendered
  // for this chunk at the server side.
  } else {
    /* eslint-disable react/no-danger */
    // Note: It looks like in dev mode with HMR the data-chunk-name attribute
    // may be lost from DOM, thus no node will be found here on re-render, and
    // thus default {} should be used as a fallback.
    const node = document.querySelector(`[data-chunk-name=${chunkName}]`) || {};
    res = (
      <div
        dangerouslySetInnerHTML={{ __html: node.innerHTML }}
        data-chunk-name={chunkName}
      />
    );
    /* eslint-disable react/no-danger */
  }

  // This effectively fires only once, just before the component unmounts.
  useEffect(() => () => {
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

  return res;
}

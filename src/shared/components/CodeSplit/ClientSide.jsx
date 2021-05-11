/**
 * Client-side implementation of a split code chunk.
 */
/* global document, window */
/* eslint-disable react/jsx-props-no-spreading */

import { useRef, useEffect } from 'react';

import { useAsyncData } from '@dr.pogodin/react-global-state';

import { getBuildInfo } from 'utils/isomorphy';
import time from 'utils/time';

export default function ClientSide({
  chunkName,
  getComponentAsync,
  placeholder,
  ...rest
}) {
  const { current: heap } = useRef({ mounted: false });
  const buildInfo = getBuildInfo();

  // publicPath from buildInfo does not have a trailing slash at the end.
  const { publicPath } = buildInfo;

  let res;

  // Async loading of React component necessary to render the chunk.
  const { data } = useAsyncData(
    `dr_pogodin_react_utils___split_components.${chunkName}`,
    getComponentAsync,
    { maxage: time.YEAR_MS },
  );

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

  /* TODO: Revise this, especially, what happens when parameters, like the
   * component is changed? */
  useEffect(() => {
    // This is a safeguard against updates of <CodeSplit> parameters after
    // the initial rendering. As noted above, it is not supported currently,
    // and probably there is no need to support it. This check will help to
    // figure it out for sure.
    if (heap.mounted) throw Error('Illegal attempt to remount a CodeSplit');
    else heap.mounted = true;

    // Stylesheets are injected via basic web APIs, rather than ReactJS,
    // because it gives a better control of stylesheet reloading, and helps
    // to avoid some unnecessary flickering when the app loads a page
    // pre-rendered at the server.
    const assets = window.CHUNK_GROUPS[chunkName];
    assets.forEach((item) => {
      if (!item.endsWith('.css')) return;
      const path = `${publicPath}/${item}`;
      let link = document.querySelector(`link[href="${path}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('href', path);
        link.setAttribute('rel', 'stylesheet');
        const head = document.querySelector('head');
        head.appendChild(link);
      }
      if (!link.dependants) link.dependants = new Set([chunkName]);
      else link.dependants.add(chunkName);
    });

    return () => {
      assets.forEach((item) => {
        if (!item.endsWith('.css')) return;
        const path = `${publicPath}/${item}`;
        const link = document.querySelector(`link[href="${path}"]`);
        link.dependants.delete(chunkName);
        if (!link.dependants.size) {
          const head = document.querySelector('head');
          head.removeChild(link);
        }
      });
    };
  }, [chunkName, heap, publicPath]);

  return res;
}

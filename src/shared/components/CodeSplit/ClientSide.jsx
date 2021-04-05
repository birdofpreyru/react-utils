/**
 * Client-side implementation of a split code chunk.
 */
/* global document, window */
/* eslint-disable react/jsx-props-no-spreading */

import { useRef, useEffect } from 'react';

import { useAsyncData } from '@dr.pogodin/react-global-state';
import dayjs from 'dayjs';

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
  const { publicPath } = buildInfo;
  const { buildTimestamp } = dayjs(buildInfo.timestamp).valueOf();

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

    const assets = window.CHUNK_GROUPS[chunkName];
    const cssAsset = assets.find((item) => item.endsWith('.css'));

    /* The links to stylesheets are injected into document header using
    * browser's API, rather than ReactJS rendering mechanism, because
    * it gives a better control over reloading of the stylesheets and
    * helps to avoid some unnecessary flickering when the app loads a
    * page already pre-rendered at the server side. */
    let link = document.querySelector(`link[href*="${cssAsset}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('href', cssAsset);
      link.setAttribute('rel', 'stylesheet');
      link.dependants = new Set([chunkName]);
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(link);
    } else link.dependants.add(chunkName);
    return () => {
      link = document.querySelector(`link[href*="${cssAsset}"]`);
      link.dependants.delete(chunkName);
      if (!link.dependants.size) {
        const head = document.getElementsByTagName('head')[0];
        head.removeChild(link);
      }
    };
  }, [buildTimestamp, chunkName, heap, publicPath]);

  return res;
}

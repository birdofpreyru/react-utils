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

/* Specifies the maximal number of unused CSS stylesheets to be kept in memory.
 */
const MAX_UNUSED_STYLESHEETS = 10;

let unusedCssStamp = 0;

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

  const { data } = useAsyncData(
    `dr_pogodin_react_utils___split_components.${chunkName}`,
    getComponentAsync,
    {
      maxage: time.YEAR_MS,
    },
  );
  if (data) {
    const Scene = data.default || data;
    res = (
      <div>
        <Scene {...rest} />
      </div>
    );
  } else if (window.SPLITS[chunkName]) {
    /* Client side rendering using SSR pre-rendered partial markup. */
    /* If the page has been pre-rendered at the server-side, we render
      * exactly the same until the splitted code is loaded. */
    /* eslint-disable react/no-danger */
    res = (
      <div
        dangerouslySetInnerHTML={{
          __html: window.SPLITS[chunkName],
        }}
      />
    );
    /* eslint-disable react/no-danger */
  } else if (placeholder) {
    /* If the page has not been pre-rendered, the best we can do prior
     * the loading of split code, is to render the placeholder, if
     * provided.
     *
     * NOTE: The <div> wrappings here and in other places below may
     * look unnecessary, but they are important: we want to be sure
     * that all render options produce the same markup, thus helping
     * ReactJS to be efficient. */
    const Scene = placeholder;
    res = (
      <div>
        <Scene {...rest} />
      </div>
    );
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

    /* The links to stylesheets are injected into document header using
    * browser's API, rather than ReactJS rendering mechanism, because
    * it gives a better control over reloading of the stylesheets and
    * helps to avoid some unnecessary flickering when the app loads a
    * page already pre-rendered at the server side. */
    let link = document.querySelector(
      `link[data-chunk="${chunkName}"]`,
    );
    if (link) {
      /* Marking the chunk being used again. */
      link.removeAttribute('data-chunk-unused');
    } else {
      link = document.createElement('link');
      link.setAttribute('data-chunk', chunkName);
      link.setAttribute('href', `${publicPath}/${chunkName}-${buildTimestamp}.css`);
      link.setAttribute('id', 'tru-style');
      link.setAttribute('rel', 'stylesheet');
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(link);

      /* Unloads unused CSS stylesheets, if too many of them are
      * loaded. */
      const unused = head.querySelectorAll('link[data-chunk-unused]');
      if (unused.length > MAX_UNUSED_STYLESHEETS) {
        const arr = [];
        unused.forEach((x) => {
          /* eslint-disable no-param-reassign */
          x.chunkOrder = Number(x.getAttribute('data-chunk-unused'));
          /* eslint-enable no-param-reassign */
          arr.push(x);
        });
        arr.sort((a, b) => a.chunkOrder - b.chunkOrder);
        arr.slice(0, unused.length - MAX_UNUSED_STYLESHEETS)
          .forEach((x) => head.removeChild(x));
      }
    }
    return () => {
      const link2 = document.querySelector(`link[data-chunk="${chunkName}"]`);

      /* TODO: This unusedCssStamp thing should be revised. Probably, not needed
       * at all. */
      if (link2) link2.setAttribute('data-chunk-unused', unusedCssStamp += 1);
    };
  }, [buildTimestamp, chunkName, heap, publicPath]);

  return res;
}

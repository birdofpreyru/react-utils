/* eslint-disable react/jsx-props-no-spreading */
/* global document, window */

import PT from 'prop-types';

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
} from 'react';

import { getGlobalState } from '@dr.pogodin/react-global-state';
import { newBarrier } from 'utils/Barrier';
import { getBuildInfo, IS_SERVER_SIDE } from 'utils/isomorphy';

export default function CodeSplit({
  children,
  chunkName,
  getComponent,
  placeholder,
  ...props
}) {
  const { current: heap } = useRef({
    mounted: false,
    pendingStyles: [],
  });
  const { publicPath } = getBuildInfo();

  // TODO: Not sure whether it is fine for the inner React.lazy() mechanics
  // if we dynamically create the lazy component inside a render of another
  // component, or does it expect we only create it once on outside of any
  // component.
  const LazyComponent = lazy(async () => {
    const res = await getComponent();
    if (heap.pendingStyles.length) await Promise.all(heap.pendingStyles);
    return res.default ? res : { default: res };
  });

  if (IS_SERVER_SIDE) {
    const { chunks } = getGlobalState().ssrContext;
    if (chunks.includes(chunkName)) {
      throw Error(`Chunk name clash for "${chunkName}"`);
    } else chunks.push(chunkName);
  } else if (!heap.mounted) {
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

        // Even if the style load failed, still allow to mount the component,
        // abeit with broken styling.
        link.onerror = barrier.resolve;

        heap.pendingStyles.push(barrier);

        const head = document.querySelector('head');
        head.appendChild(link);
      }
      window.STYLESHEET_USAGE_COUNTERS ||= {};
      window.STYLESHEET_USAGE_COUNTERS[path] ||= 0;
      ++window.STYLESHEET_USAGE_COUNTERS[path];
    });
  }

  // This effectively fires only once, just before the component unmounts.
  useEffect(() => () => {
    heap.mounted = false;
    window.CHUNK_GROUPS[chunkName].forEach((item) => {
      if (!item.endsWith('.css')) return;
      const path = `${publicPath}/${item}`;
      if (--window.STYLESHEET_USAGE_COUNTERS[path] <= 0) {
        const link = document.querySelector(`link[href="${path}"]`);
        const head = document.querySelector('head');
        head.removeChild(link);
      }
    });
  }, [chunkName, heap, publicPath]);

  return (
    <Suspense fallback={placeholder}>
      <LazyComponent {...props}>
        {children}
      </LazyComponent>
    </Suspense>
  );
}

CodeSplit.propTypes = {
  children: PT.node,
  chunkName: PT.string.isRequired,
  getComponent: PT.func.isRequired,
  placeholder: PT.node,
};

CodeSplit.defaultProps = {
  children: undefined,
  placeholder: undefined,
};

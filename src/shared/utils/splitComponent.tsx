/* eslint-disable react/jsx-props-no-spreading */
/* global document */

import {
  type ComponentType,
  type ReactNode,
  forwardRef,
  lazy,
  Suspense,
  useInsertionEffect,
} from 'react';

import { Barrier } from '@dr.pogodin/js-utils';

import { type ChunkGroupsT, getSsrContext } from './globalState';

import {
  IS_CLIENT_SIDE,
  IS_SERVER_SIDE,
  getBuildInfo,
} from './isomorphy';

// Note: At the client side we can get chunk groups immediately when loading
// the module; at the server-side we only can get them within React render flow.
// Thus, we set and use the following variable at the client-side, and then when
// needed on the server side, we'll fetch it differently.
let clientChunkGroups: ChunkGroupsT;

if (IS_CLIENT_SIDE) {
  // eslint-disable-next-line global-require
  clientChunkGroups = require('client/getInj').default().CHUNK_GROUPS || {};
}

const refCounts: { [path: string]: number } = {};

function getPublicPath() {
  return getBuildInfo().publicPath;
}

/**
 * Client-side only! Ensures the specified CSS stylesheet is loaded into
 * the document; loads if it is missing; and does simple reference counting
 * to facilitate future clean-up.
 * @param name
 * @param loadedSheets
 * @param refCount
 * @return
 */
function bookStyleSheet(
  name: string,
  loadedSheets: Set<string>,
  refCount: boolean,
): Promise<void> | undefined {
  let res: Barrier<void> | undefined;
  const path = `${getPublicPath()}/${name}`;
  const fullPath = `${document.location.origin}${path}`;

  if (!loadedSheets.has(fullPath)) {
    let link = document.querySelector(`link[href="${path}"]`);

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', path);
      document.head.appendChild(link);
    }

    res = new Barrier<void>();
    link.addEventListener('load', () => res!.resolve());
    link.addEventListener('error', () => res!.resolve());
  }

  if (refCount) {
    const current = refCounts[path] || 0;
    refCounts[path] = 1 + current;
  }

  return res;
}

/**
 * Generates the set of URLs for currently loaded, linked stylesheets.
 * @return
 */
function getLoadedStyleSheets(): Set<string> {
  const res = new Set<string>();
  const { styleSheets } = document;
  for (let i = 0; i < styleSheets.length; ++i) {
    const { href } = styleSheets[i];
    if (href) res.add(href);
  }
  return res;
}

function assertChunkName(
  chunkName: string,
  chunkGroups: ChunkGroupsT,
) {
  if (chunkGroups[chunkName]) return;
  throw Error(`Unknown chunk name "${chunkName}"`);
}

/**
 * Client-side only! Ensures all CSS stylesheets required for the specified
 * code chunk are loaded into the document; loads the missing ones; and does
 * simple reference counting to facilitate future clean-up.
 * @param chunkName Chunk name.
 * @param refCount
 * @return Resolves once all pending stylesheets, necessary for
 *  the chunk, are either loaded, or failed to load.
 */
export function bookStyleSheets(
  chunkName: string,
  chunkGroups: ChunkGroupsT,
  refCount: boolean,
): Promise<void> {
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

  return promises.length
    ? Promise.allSettled(promises).then()
    : Promise.resolve();
}

/**
 * Client-side only! Frees from the document all CSS stylesheets that are
 * required by the specified chunk, and have reference counter equal to one
 * (for chunks with larger reference counter values, it just decrements
 * the reference counter).
 * @param {string} chunkName
 */
export function freeStyleSheets(
  chunkName: string,
  chunkGroups: ChunkGroupsT,
) {
  const assets = chunkGroups[chunkName];
  for (let i = 0; i < assets.length; ++i) {
    const asset = assets[i];
    if (asset.endsWith('.css')) {
      const path = `${getPublicPath()}/${asset}`;
      if (--refCounts[path] <= 0) {
        document.head.querySelector(`link[href="${path}"]`)!.remove();
      }
    }
  }
}

// Holds the set of chunk names already used for splitComponent() calls.
const usedChunkNames = new Set();

type ComponentOrModule<PropsT> = ComponentType<PropsT> | {
  default: ComponentType<PropsT>,
};

/**
 * Given an async component retrieval function `getComponent()` it creates
 * a special "code split" component, which uses <Suspense> to asynchronously
 * load on demand the code required by `getComponent()`.
 * @param options
 * @param options.chunkName
 * @param {function} options.getComponent
 * @param {React.Element} [options.placeholder]
 * @return {React.ElementType}
 */
export default function splitComponent<
  ComponentPropsT extends { children?: ReactNode },
>({
  chunkName,
  getComponent,
  placeholder,
}: {
  chunkName: string;
  getComponent: () => Promise<ComponentOrModule<ComponentPropsT>>,
  placeholder?: ReactNode,
}) {
  // On the client side we can check right away if the chunk name is known.
  if (IS_CLIENT_SIDE) assertChunkName(chunkName, clientChunkGroups);

  // The correct usage of splitComponent() assumes a single call per chunk.
  if (usedChunkNames.has(chunkName)) {
    throw Error(`Repeated splitComponent() call for the chunk "${chunkName}"`);
  } else usedChunkNames.add(chunkName);

  const LazyComponent = lazy(async () => {
    const resolved = await getComponent();
    const Component = 'default' in resolved ? resolved.default : resolved;

    // This pre-loads necessary stylesheets prior to the first mount of
    // the component (the lazy load function is executed by React one at
    // the frist mount).
    if (IS_CLIENT_SIDE) {
      await bookStyleSheets(chunkName, clientChunkGroups, false);
    }

    const Wrapper = forwardRef((
      { children, ...rest }: ComponentPropsT,
      ref,
    ) => {
      // On the server side we'll assert the chunk name here,
      // and also push it to the SSR chunks array.
      if (IS_SERVER_SIDE) {
        const { chunkGroups, chunks } = getSsrContext()!;
        assertChunkName(chunkName, chunkGroups);
        if (!chunks.includes(chunkName)) chunks.push(chunkName);
      }

      // This takes care about stylesheets management every time an instance of
      // this component is mounted / unmounted.
      useInsertionEffect(() => {
        bookStyleSheets(chunkName, clientChunkGroups, true);
        return () => freeStyleSheets(chunkName, clientChunkGroups);
      }, []);

      return (
        <Component ref={ref} {...rest as ComponentPropsT}>
          {children}
        </Component>
      );
    });

    return { default: Wrapper };
  });

  const CodeSplit: React.FunctionComponent<ComponentPropsT> = ({
    children,
    ...rest
  }: ComponentPropsT) => (
    <Suspense fallback={placeholder}>
      <LazyComponent {...rest as Parameters<typeof LazyComponent>[0]}>
        {children}
      </LazyComponent>
    </Suspense>
  );

  return CodeSplit;
}

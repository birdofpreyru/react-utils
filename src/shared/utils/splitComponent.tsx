/* global document */

import {
  type ComponentType,
  type FunctionComponent,
  type ReactNode,
  type RefObject,
  Suspense,
  lazy,
  useInsertionEffect,
} from 'react';

import { Barrier } from '@dr.pogodin/js-utils';

import { type ChunkGroupsT, getSsrContext } from './globalState';

import {
  IS_CLIENT_SIDE,
  IS_SERVER_SIDE,
  getBuildInfo,
} from './isomorphy';

function getClientChunkGroups(): Promise<ChunkGroupsT> | undefined {
  if (!IS_CLIENT_SIDE) return undefined;

  return (async () => {
    const { default: getInj } = await import(/* webpackChunkName: "react-utils-client-side-code" */ '../../client/getInj');
    return getInj().CHUNK_GROUPS ?? {};
  })();
}

const refCounts: Record<string, number> = {};

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
    link.addEventListener('load', () => {
      if (!res) throw Error('Internal error');
      void res.resolve();
    });
    link.addEventListener('error', () => {
      if (!res) throw Error('Internal error');
      void res.resolve();
    });
  }

  if (refCount) {
    const current = refCounts[path] ?? 0;
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
  for (const { href } of styleSheets) {
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
export async function bookStyleSheets(
  chunkName: string,
  chunkGroups: ChunkGroupsT,
  refCount: boolean,
): Promise<void> {
  const promises = [];
  const assets = chunkGroups[chunkName];
  if (!assets) return Promise.resolve();

  const loadedSheets = getLoadedStyleSheets();

  for (const asset of assets) {
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
): void {
  const assets = chunkGroups[chunkName];
  if (!assets) return;

  for (const asset of assets) {
    if (asset.endsWith('.css')) {
      const path = `${getPublicPath()}/${asset}`;

      const pathRefCount = refCounts[path];
      if (pathRefCount) {
        if (pathRefCount <= 1) {
          document.head.querySelector(`link[href="${path}"]`)!.remove();
          delete refCounts[path];
        } else refCounts[path] = pathRefCount - 1;
      }
    }
  }
}

// Holds the set of chunk names already used for splitComponent() calls.
const usedChunkNames = new Set();

type ComponentOrModule<PropsT> = ComponentType<PropsT> | {
  default: ComponentType<PropsT>;
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
  ComponentPropsT extends { children?: ReactNode; ref?: RefObject<unknown> },
>({
  chunkName,
  getComponent,
  placeholder,
}: {
  chunkName: string;
  getComponent: () => Promise<ComponentOrModule<ComponentPropsT>>;
  placeholder?: ReactNode;
}): FunctionComponent<ComponentPropsT> {
  // The correct usage of splitComponent() assumes a single call per chunk.
  if (usedChunkNames.has(chunkName)) {
    throw Error(`Repeated splitComponent() call for the chunk "${chunkName}"`);
  } else usedChunkNames.add(chunkName);

  const LazyComponent = lazy(async () => {
    const clientChunkGroups = await getClientChunkGroups();

    // On the client side we can check right away if the chunk name is known.
    if (IS_CLIENT_SIDE) {
      if (!clientChunkGroups) throw Error('Internal error');
      assertChunkName(chunkName, clientChunkGroups);
    }

    const resolved = await getComponent();
    const Component = 'default' in resolved ? resolved.default : resolved;

    // This pre-loads necessary stylesheets prior to the first mount of
    // the component (the lazy load function is executed by React one at
    // the frist mount).
    if (IS_CLIENT_SIDE) {
      if (!clientChunkGroups) throw Error('Internal error');
      await bookStyleSheets(chunkName, clientChunkGroups, false);
    }

    const Wrapper: FunctionComponent<ComponentPropsT> = ({
      children,
      ref,
      ...rest
    }) => {
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
        if (!clientChunkGroups) throw Error('Internal error');
        void bookStyleSheets(chunkName, clientChunkGroups, true);
        return () => {
          freeStyleSheets(chunkName, clientChunkGroups);
        };
      }, []);

      return (
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(rest as unknown as ComponentPropsT)}
          ref={ref}
        >
          {children}
        </Component>
      );
    };

    return { default: Wrapper };
  });

  const CodeSplit: React.FunctionComponent<ComponentPropsT> = ({
    children,
    ...rest
  }: ComponentPropsT) => (
    <Suspense fallback={placeholder}>
      <LazyComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest as Parameters<typeof LazyComponent>[0]}
      >
        {children}
      </LazyComponent>
    </Suspense>
  );

  return CodeSplit;
}

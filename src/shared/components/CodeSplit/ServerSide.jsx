/**
 * Server-side implementation.
 */
/* eslint-disable react/jsx-props-no-spreading */

import ReactDom from 'react-dom/server';
import PT from 'prop-types';

import {
  getGlobalState,
  GlobalStateProvider,
  useAsyncData,
} from '@dr.pogodin/react-global-state';

import { useResolvedPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

export default function ServerSide({
  chunkName,
  getClientSide,
  serverSide,
  placeholder,
  children,
  ...rest
}) {
  /* 1. The component, or its placeholder is rendered into HTML string.
   *    The component is wrapped into <GlobalStateProvider>, and <StaticRouter>
   *    to ensure that global state, and react router will work inside
   *    the component, if present there. Also, if no server-side (sync) way
   *    to load the component is provider, `useAsyncData(..)` is used to
   *    attempt to load and use the component via SSR mechanics. */
  let Scene;
  if (serverSide) Scene = serverSide;
  else {
    // In this case we are sure the condition won't change during the rendering
    // loop, thus we can ignore the rule.
    /* eslint-disable react-hooks/rules-of-hooks */
    const { data } = useAsyncData(
      `dr_pogodin_react_utils___split_components.${chunkName}`,
      getClientSide,
    );
    Scene = data ? (data.default || data) : (placeholder || (() => null));
    /* eslint-enable react-hooks/rules-of-hooks */
  }

  const globalState = getGlobalState();
  const { pathname } = useResolvedPath('');
  const html = ReactDom.renderToString((
    <GlobalStateProvider stateProxy={globalState}>
      <StaticRouter
        basename={pathname}
        location={globalState.ssrContext.req.url}
      >
        <Scene {...rest}>
          {children}
        </Scene>
      </StaticRouter>
    </GlobalStateProvider>
  ));

  /* 2. `chunks` array is used to record CSS chunks to inject. */
  const { chunks } = globalState.ssrContext;
  if (chunks.includes(chunkName)) {
    throw new Error(`CodeSplit: chunk name clash for (${chunkName})`);
  } else chunks.push(chunkName);

  /* The result is rendered using the container with `dangerouslySetInnerHTML`
   * to allow reproduce the same rendering result at the client side, even prior
   * to the async loading of the split code. */
  /* eslint-disable react/no-danger */
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      data-chunk-name={chunkName}
    />
  );
  /* eslint-enable react/no-danger */
}

ServerSide.propTypes = {
  children: PT.node,
  chunkName: PT.string.isRequired,

  // Note: it is not strictly required by <ServerSide> component per se,
  // as it is expected that in most cases "serverSide" prop should be provided,
  // however "getClientSide" prop is still used as a fallback at the server side
  // and also it is required by the parent splitComponent() function, so no harm
  // to declare it as required here.
  getClientSide: PT.func.isRequired,

  placeholder: PT.elementType,
  serverSide: PT.elementType,
};

ServerSide.defaultProps = {
  children: undefined,
  placeholder: null,
  serverSide: undefined,
};

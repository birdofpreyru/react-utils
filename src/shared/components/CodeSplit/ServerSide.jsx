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
import { StaticRouter } from 'react-router-dom';

export default function ServerSide({
  chunkName,
  getComponentAsync,
  getComponentServer,
  placeholder,
  ...rest
}) {
  /* 1. The component, or its placeholder is rendered into HTML string.
   *    The component is wrapped into <GlobalStateProvider>, and <StaticRouter>
   *    to ensure that global state, and react router will work inside
   *    the component, if present there. Also, if no server-side (sync) way
   *    to load the component is provider, `useAsyncData(..)` is used to
   *    attempt to load and use the component via SSR mechanics. */
  let Scene;
  if (getComponentServer) Scene = getComponentServer();
  else {
    // In this case we are sure the condition won't change during the rendering
    // loop, thus we can ignore the rule.
    /* eslint-disable react-hooks/rules-of-hooks */
    const { data } = useAsyncData(
      `dr_pogodin_react_utils___split_components.${chunkName}`,
      getComponentAsync,
    );
    Scene = data ? (data.default || data) : (placeholder || (() => null));
    /* eslint-enable react-hooks/rules-of-hooks */
  }

  const globalState = getGlobalState();
  const html = ReactDom.renderToString((
    <GlobalStateProvider stateProxy={globalState}>
      <StaticRouter
        context={globalState.ssrContext}
        location={globalState.ssrContext.req.url}
      >
        <Scene {...rest} />
      </StaticRouter>
    </GlobalStateProvider>
  ));

  /* 2. The rendered HTML string is added to the SSR context to be injected by
   *    the renderer into the frontend (via window.SPLITS object). We also
   *    check chunkName is unique, thus does not break this scheme.
   *
   *    `chunks` array is used to record CSS chunks to inject. */
  /* TODO: Probably, there is a way to make it work without the splits passed
   * to the frontend, just making the client-side code to read and reuse
   * the actual HTML markup received from the backend. */
  const { chunks, splits } = globalState.ssrContext;
  if (splits[chunkName]) throw new Error('CodeSplit: ID clash!');
  else splits[chunkName] = html;
  chunks.push(chunkName);

  /* The result is rendered using the container with `dangerouslySetInnerHTML`
   * to allow reproduce the same rendering result at the client side, even prior
   * to the async loading of the split code. */
  /* eslint-disable react/no-danger */
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
  /* eslint-enable react/no-danger */
}

ServerSide.propTypes = {
  chunkName: PT.string.isRequired,
  getComponentAsync: PT.func,
  getComponentServer: PT.func,
  placeholder: PT.elementType,
};

ServerSide.defaultProps = {
  getComponentAsync: null,
  getComponentServer: null,
  placeholder: null,
};

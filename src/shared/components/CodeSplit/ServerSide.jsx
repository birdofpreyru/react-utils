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
import { StaticRouter } from 'react-router-dom/server';

/**
 * A specially wrapped `require()`, which is passed as an argument into
 * the optional `getComponentServer` prop of <{@link CodeSplit}> component.
 * @param {string} base Path resolution base, you want to pass in `__dirname`
 * value from the host module using `<CodeSplit>`.
 * @param {string} path The path of module to require.
 * @return {object} Required module.
 */
function resolveRequire(base, path) {
  // NOTE: A part of code here attempts to correctly load ES6 modules
  // transformed by Babel; namely if required module has "default" field,
  // all other fields (presumed to be named exports) are attached to
  // the "default".
  const p = require.resolve(path, { paths: [base] });
  /* eslint-disable global-require, import/no-dynamic-require */
  const { default: def, ...named } = require(p);
  /* eslint-enable global-require, import/no-dynamic-require */
  if (!def) return named;

  Object.entries(named).forEach(([key, value]) => {
    if (def[key]) throw Error('Conflict between default and named exports');
    def[key] = value;
  });
  return def;
}

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
  if (getComponentServer) Scene = getComponentServer(resolveRequire);
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
      <StaticRouter location={globalState.ssrContext.req.url || '/'}>
        <Scene {...rest} />
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

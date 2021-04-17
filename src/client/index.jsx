// Initialization of client-side code.
/* global document, window */

import {
  GlobalStateProvider,
  useGlobalState,
} from '@dr.pogodin/react-global-state';

import { useState } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/**
 * This dummy component clears the code chunk cache in the global state each
 * time the epoch prop changes.
 * @ignore
 */
function HmrHelper({ epoch }) {
  const [currentEpoch, setCurrentEpoch] = useState(epoch);
  const [, setCache] = useGlobalState(
    'dr_pogodin_react_utils___split_components',
    {},
  );
  if (epoch !== currentEpoch) {
    setCurrentEpoch(epoch);
    setCache({});
  }
  return null;
}

/**
 * Renders given application into DOM, providing it with the initial global
 * state.
 * @param {Function} Application Root ReactJS component of the app.
 * @param {Object} initialState Optional. Initial value of the global state.
 * @param {Number} hmrEpoch Optional. HMR epoch. It is needed to handle HMR of
 *  split code chunks.
 * @ignore
 */
function render(Application, { initialState, hmrEpoch } = {}) {
  let app = (
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  );
  app = (
    <GlobalStateProvider initialState={initialState}>
      { hmrEpoch ? <HmrHelper epoch={hmrEpoch} /> : null }
      {app}
    </GlobalStateProvider>
  );
  ReactDom.hydrate(app, document.getElementById('react-view'));
}

/**
 * @category Utilities
 * @func client
 * @desc
 * ```js
 * import { client } from '@dr.pogodin/react-utils';
 * ```
 * Prepares and launches the app at client side.
 * @param {object} options App configuraiton options. Most of them are necessary
 * to correctly set up Hot Module Reloading in _development_ mode.
 * @param {string} options.applicationModulePath Path to the root application
 * module.
 * @param {function} options.getApplication A function which on each call
 * requires the root app module, and returns the root application component.
 * @param {object} options.moduleHot This should be set to `module.hot` value
 * from the caller module's context.
 * @example
 * import { client } from '@dr.pogodin/react-utils';
 * client({
 *   applicationModulePath: require.resolve('../shared'),
 *   getApplication: () => require('../shared').default,
 *   moduleHot: module.hot,
 * });
 */
export default function Launch({
  applicationModulePath,
  getApplication,
  moduleHot,
}) {
  let hmrEpoch = moduleHot && applicationModulePath ? 1 : 0;
  render(
    getApplication(),
    {
      initialState: window.ISTATE,
      hmrEpoch,
    },
  );

  if (hmrEpoch) {
    moduleHot.accept(
      applicationModulePath,
      () => {
        hmrEpoch += 1;
        render(getApplication(), { hmrEpoch });
      },
    );
  }
}

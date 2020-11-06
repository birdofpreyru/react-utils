/**
 * Initialization of client-side code.
 */

/* global document, window */

import {
  GlobalStateProvider,
  useGlobalState,
} from '@dr.pogodin/react-global-state';
import { v4 as uuid } from 'uuid';

import { useState } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/**
 * This dummy component clears the code chunk cache in the global state each
 * time the epoch prop changes.
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
 * Initializes the code at client side. It takes care about receiving the data
 * injected at the server-side, and also about setting up client side of hot
 * module reloading (HMR).
 * @param {String} applicationModulePath Optional.
 * @param {Function} getApplication
 * @param {Object} moduleHot
 */
export default async function Launch({
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

    /* HMR of CSS code each time webpack hot middleware updates the code. */
    moduleHot.addStatusHandler((status) => {
      if (status !== 'ready') return;
      const stamp = uuid();
      const links = document.querySelectorAll('link[rel=stylesheet][id="tru-style"]');
      for (let i = 0; i < links.length; i += 1) {
        links[i].href = `${links[i].href.match(/[^?]*/)}?v=${stamp}`;
      }
    });
  }
}

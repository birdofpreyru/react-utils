/**
 * Initialization of client-side code.
 */

/* global document, window */

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import React from 'react';
import ReactDom from 'react-dom';
import shortId from 'shortid';
import { BrowserRouter } from 'react-router-dom';

/**
 * Renders given application into DOM, providing it with the initial global
 * state.
 * @param {Function} Application Root ReactJS component of the app.
 * @param {Object} initialState Optional. Initial value of the global state.
 */
function render(Application, initialState) {
  let app = (
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  );
  app = (
    <GlobalStateProvider initialState={initialState}>
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
  render(getApplication(), window.ISTATE);

  if (moduleHot && applicationModulePath) {
    moduleHot.accept(applicationModulePath,
      () => render(getApplication(), window.ISTATE));

    /* HMR of CSS code each time webpack hot middleware updates the code. */
    moduleHot.addStatusHandler((status) => {
      if (status !== 'ready') return;
      const stamp = shortId();
      const links = document.querySelectorAll('link[rel=stylesheet][id="tru-style"]');
      for (let i = 0; i < links.length; i += 1) {
        links[i].href = `${links[i].href.match(/[^?]*/)}?v=${stamp}`;
      }
    });
  }
}

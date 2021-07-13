// Initialization of client-side code.
/* global document, window */

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/**
 * @category Utilities
 * @func client
 * @desc
 * ```js
 * import { client } from '@dr.pogodin/react-utils';
 * ```
 * Prepares and launches the app at client side.
 * @param {object} Application Root application component
 */
export default function Launch(Application) {
  ReactDom.hydrate((
    <GlobalStateProvider initialState={window.ISTATE}>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </GlobalStateProvider>
  ), document.getElementById('react-view'));
}

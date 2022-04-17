// Initialization of client-side code.
/* global document, window */

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

/**
 * Prepares and launches the app at client side.
 * @param {object} Application Root application component
 */
export default function Launch(Application) {
  hydrateRoot(
    document.getElementById('react-view'),
    <GlobalStateProvider initialState={window.ISTATE}>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </GlobalStateProvider>,
  );
}

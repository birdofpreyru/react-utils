// Initialization of client-side code.
/* global document, window */

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

/**
 * Prepares and launches the app at client side.
 * @param {object} Application Root application component
 * @param {object} [options={}] Optional. Additional settings.
 */
export default function Launch(Application, options = {}) {
  const container = document.getElementById('react-view');
  const scene = (
    <GlobalStateProvider initialState={window.ISTATE}>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </GlobalStateProvider>
  );

  if (options.dontHydrate) {
    const root = createRoot(container);
    root.render(scene);
  } else hydrateRoot(container, scene);
}

// Initialization of client-side code.
/* global document */

import { type ComponentType } from 'react';

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import getInj from './getInj';

type OptionsT = {
  dontHydrate?: boolean;
};

/**
 * Prepares and launches the app at client side.
 * @param Application Root application component
 * @param [options={}] Optional. Additional settings.
 */
export default function Launch(
  Application: ComponentType,
  options: OptionsT = {},
) {
  const container = document.getElementById('react-view');
  if (!container) throw Error('Failed to find container for React app');
  const scene = (
    <GlobalStateProvider initialState={getInj().ISTATE}>
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

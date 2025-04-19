// Initialization of client-side code.
/* global document */

import type { ComponentType } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { BrowserRouter } from 'react-router';

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import getInj from './getInj';

type OptionsT = {
  dontHydrate?: boolean;
  initialState?: unknown;
};

/**
 * Prepares and launches the app at client side.
 * @param Application Root application component
 * @param [options={}] Optional. Additional settings.
 */
export default function Launch(
  Application: ComponentType,
  options: OptionsT = {},
): void {
  const container = document.getElementById('react-view');
  if (!container) throw Error('Failed to find container for React app');
  const scene = (
    <GlobalStateProvider initialState={getInj().ISTATE ?? options.initialState}>
      <BrowserRouter>
        <HelmetProvider>
          <Application />
        </HelmetProvider>
      </BrowserRouter>
    </GlobalStateProvider>
  );

  if (options.dontHydrate) {
    const root = createRoot(container);
    root.render(scene);
  } else hydrateRoot(container, scene);
}

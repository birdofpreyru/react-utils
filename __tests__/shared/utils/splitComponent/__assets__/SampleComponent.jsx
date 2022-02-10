/**
 * This is a sample component, which will reside in a split code.
 *
 * Note: <Route> and `useGlobalState(..)` are used here on purpose, to verify
 * that code splitting has not broke related functionality.
 */

import { Route, Routes } from 'react-router-dom';

import { useGlobalState } from '@dr.pogodin/react-global-state';

export default function SampleComponent() {
  const [state] = useGlobalState();
  return (
    <Routes>
      <Route
        path=""
        element={(
          <div>
            <h1>Sample Component</h1>
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        )}
      />
    </Routes>
  );
}

/**
 * This is a sample component, which will reside in a split code.
 *
 * Note: <Route> and `useGlobalState(..)` are used here on purpose, to verify
 * that code splitting has not broke related functionality.
 */

import { Route, Routes } from 'react-router-dom';
import { useGlobalState } from '@dr.pogodin/react-global-state';

import './style.scss';

export default function SampleComponent({ children, prop = '' }) {
  const [testKey] = useGlobalState('test.key');
  return (
    <Routes>
      <Route
        path=""
        element={(
          <div>
            <h1>Sample Component</h1>
            <div>{testKey}</div>
            <h3>Prop</h3>
            <div>{prop}</div>
            <h3>Children</h3>
            <div>
              {children}
            </div>
          </div>
        )}
      />
    </Routes>
  );
}

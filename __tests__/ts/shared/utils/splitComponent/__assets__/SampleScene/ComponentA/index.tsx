/**
 * This is a sample component, which will reside in a split code.
 *
 * Note: <Route> and `useGlobalState(..)` are used here on purpose, to verify
 * that code splitting has not broke related functionality.
 */

import PT from 'prop-types';
import { type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { type ForceT, useGlobalState } from '@dr.pogodin/react-global-state';

import './style.scss';

type PropsT = {
  children?: ReactNode;
  prop?: string;
};

const SampleComponent: React.FunctionComponent<PropsT> = ({ children, prop = '' }) => {
  const [testKey] = useGlobalState<ForceT, string>('test.key', '');
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
};

SampleComponent.propTypes = {
  children: PT.node,
  prop: PT.string,
};

export default SampleComponent;

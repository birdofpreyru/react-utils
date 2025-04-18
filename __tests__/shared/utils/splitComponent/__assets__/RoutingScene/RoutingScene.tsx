import type { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router';
import splitComponent from 'utils/splitComponent';

// Note: this is not exactly how splitComponent() should be used to actually
// split the code during Webpack build, but this simplistic code is enough
// to test its behavior alongside React Router use.
const Split = splitComponent({
  chunkName: 'split',
  getComponent: async () => import(
    /* webpackChunkName: 'split' */'./InnerRouter'
  ),
});

export const RoutingScene1: FunctionComponent = () => (
  <Routes>
    <Route element={<Split />} path="/base/*" />
  </Routes>
);

export const RoutingScene2: FunctionComponent = () => <Split />;

import { Route, Routes } from 'react-router-dom';
import splitComponent from 'utils/splitComponent';

// Note: this is not exactly how splitComponent() should be used to actually
// split the code during Webpack build, but this simplistic code is enough
// to test its behavior alongside React Router use.
const Split = splitComponent({
  chunkName: 'split',
  getComponent: () => import(
    /* webpackChunkName: 'split' */'./InnerRouter'
  ),
});

export function RoutingScene1() {
  return (
    <Routes>
      <Route path="/base/*" element={<Split />} />
    </Routes>
  );
}

export function RoutingScene2() {
  return <Split />;
}

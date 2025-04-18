import type { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router';

const Component = () => <div>Hello World!</div>;

const InnerRouter: FunctionComponent = () => (
  <Routes>
    <Route element={<Component />} path="hello-world" />
  </Routes>
);

export default InnerRouter;

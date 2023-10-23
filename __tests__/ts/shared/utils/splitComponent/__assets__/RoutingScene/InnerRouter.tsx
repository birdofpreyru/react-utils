import { Route, Routes } from 'react-router-dom';

const Component = () => <div>Hello World!</div>;

const InnerRouter = () => (
  <Routes>
    <Route path="hello-world" element={<Component />} />
  </Routes>
);

export default InnerRouter;

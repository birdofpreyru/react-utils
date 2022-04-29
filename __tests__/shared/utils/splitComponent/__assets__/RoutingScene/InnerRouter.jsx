import { Route, Routes } from 'react-router-dom';

function Component() {
  return <div>Hello World!</div>;
}

export default function InnerRouter() {
  return (
    <Routes>
      <Route path="hello-world" element={<Component />} />
    </Routes>
  );
}

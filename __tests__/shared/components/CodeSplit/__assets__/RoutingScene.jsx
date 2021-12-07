import { Route, Routes } from 'react-router-dom';
import CodeSplit from 'components/CodeSplit';

function Component() {
  return <div>Hello World!</div>;
}

function InnerRouter() {
  return (
    <Routes>
      <Route path="hello-world" element={<Component />} />
    </Routes>
  );
}

// NOTE: This is not how <CodeSplit> should be used to actually split the code
// during Webpack build, but this simplistic code is enough to test its behavior
// alongside React Router use.
function Split() {
  return (
    <CodeSplit
      chunkName="split"
      getComponentAsync={() => InnerRouter}
      getComponentServer={() => InnerRouter}
    />
  );
}

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

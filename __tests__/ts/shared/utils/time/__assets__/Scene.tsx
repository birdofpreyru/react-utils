/**
 * A few components independently rendering the current time.
 */

import { useCurrent } from 'utils/time';

const ComponentA: React.FunctionComponent = () => {
  const now = useCurrent();
  return (
    <div>
      A: Current time is: {now}
    </div>
  );
};

const ComponentB: React.FunctionComponent = () => {
  const now = useCurrent();
  return (
    <div>
      B: Current time is: {now}
    </div>
  );
};

const Scene: React.FunctionComponent = () => (
  <div>
    <ComponentA />
    <ComponentB />
  </div>
);

export default Scene;

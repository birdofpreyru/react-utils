/**
 * A few components independently rendering the current time.
 */

import { useCurrent } from 'utils/time';

function ComponentA() {
  const now = useCurrent();
  return (
    <div>
      A: Current time is: {now}
    </div>
  );
}

function ComponentB() {
  const now = useCurrent();
  return (
    <div>
      B: Current time is: {now}
    </div>
  );
}

export default function Scene() {
  return (
    <div>
      <ComponentA />
      <ComponentB />
    </div>
  );
}

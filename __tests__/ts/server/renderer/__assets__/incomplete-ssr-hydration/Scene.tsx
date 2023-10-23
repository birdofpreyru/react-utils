import type { Timer } from '@dr.pogodin/js-utils';

import RGS, {
  type API,
  type AsyncDataEnvelopeT,
} from '@dr.pogodin/react-global-state';

import time from 'utils/time';

type StateT = {
  badData: AsyncDataEnvelopeT<string>;
  goodData: AsyncDataEnvelopeT<string>;
};

const { useAsyncData } = RGS as API<StateT>;

// The first one resolves after a long wait only,
// the second one resolves right away.

const timers: Timer<void>[] = [];

export function cleanup() {
  for (let i = 0; i < timers.length; ++i) {
    timers[i].abort();
    timers[i].resolve();
  }
}

// NOTE: The line below is how it should look like, but it somehow causes
// an obscure crash in react-global-state, thus the version with 30ms timeout.
// const badLoader = () => new Promise();
const badLoader = async () => {
  // TODO: This cause some problem in tests: Jest does not exit until this
  // promise resolves, even if we fire the cleanup logic above in SSR.
  // Not sure, is it a problem with SSR renderer, or we miss to clean up
  // in a test DOM environment (like the frontend)?
  const timer = time.timer(5 * time.SEC_MS);
  timers.push(timer);
  await timer;
  // console.log('BAD LOADER RESOLVES');
  return 'SOMETHING IS WRONG IF YOU READ THIS';
};

const goodLoader = () => Promise.resolve('Hello World!');

const Scene: React.FunctionComponent = () => {
  const { data: badData } = useAsyncData('badData', badLoader);
  const { data: goodData } = useAsyncData('goodData', goodLoader);
  return (
    <div>
      <div>{badData}</div>
      <div>{goodData}</div>
    </div>
  );
};

export default Scene;

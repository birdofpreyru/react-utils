import { useAsyncData } from '@dr.pogodin/react-global-state';
import { timer } from 'utils/time';

// The first one never resolves, the second one resolves right away.

// NOTE: The line below is how it should look like, but it somehow causes
// an obscure crash in react-global-state, thus the version with 30ms timeout.
// const badLoader = () => new Promise();
const badLoader = async () => {
  await timer(30);
};

const goodLoader = () => Promise.resolve('Hello World!');

export default function Scene() {
  const { data: badData } = useAsyncData('badData', badLoader);
  const { data: goodData } = useAsyncData('goodData', goodLoader);
  return (
    <div>
      <div>{badData}</div>
      <div>{goodData}</div>
    </div>
  );
}

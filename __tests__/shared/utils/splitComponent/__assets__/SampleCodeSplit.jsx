/**
 * This is a sample component, doing a code split.
 */

import { useGlobalState } from '@dr.pogodin/react-global-state';

import splitComponent from 'utils/splitComponent';

function Placeholder() {
  return <div>PLACEHOLDER!</div>;
}

const SampleComponent1 = splitComponent({
  chunkName: 'sample-component-1',
  getComponent: () => import('./SampleComponent'),
});

const SampleComponent2 = splitComponent({
  chunkName: 'sample-component-2',
  getComponent: () => import('./SampleComponent'),
  placeholder: <Placeholder />,
});

const SampleComponent3 = splitComponent({
  chunkName: 'sample-component-3',
  getComponent: () => import('./SampleComponent'),
});

export default function SampleCodeSplit() {
  const [testKey] = useGlobalState('test.key', 'testValue');
  return (
    <>
      <h1>SampleCodeSplit</h1>
      <div>{testKey}</div>
      <SampleComponent1 />
      <SampleComponent2 prop="test">
        Test
      </SampleComponent2>
      <SampleComponent3>
        <div>a</div>
        <div>b</div>
      </SampleComponent3>
    </>
  );
}

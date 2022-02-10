/**
 * This is a sample component, doing a code split.
 */

import { useGlobalState } from '@dr.pogodin/react-global-state';

import splitComponent from 'utils/splitComponent';
import { requireWeak } from 'utils/webpack';

function Placeholder() {
  return <div>PLACEHOLDER!</div>;
}

const SampleComponent1 = splitComponent({
  chunkName: 'sample-component-1',
  getClientSide: () => import(
    /* webpackChunkName: 'sample-component-1' */ './SampleComponent'
  ),
});

const SampleComponent2 = splitComponent({
  chunkName: 'sample-component-2',
  getClientSide: () => import(
    /* webpackChunkName: 'sample-component-2' */ './SampleComponent'
  ),
  placeholder: Placeholder,
});

const SampleComponent3 = splitComponent({
  chunkName: 'sample-component-3',
  getClientSide: () => import(
    /* webpackChunkName: 'sample-component-3' */ './SampleComponent'
  ),
  placeholder: Placeholder,
  serverSide: requireWeak('./SampleComponent', __dirname),
});

export default function SampleCodeSplit() {
  const [testKey] = useGlobalState('test.key', 'testValue');
  return (
    <>
      <h1>{testKey}</h1>
      <SampleComponent1 />
      <SampleComponent2 />
      <SampleComponent3 />
    </>
  );
}

/**
 * This is a sample component, doing a code split.
 */

import { useGlobalState } from '@dr.pogodin/react-global-state';

import splitComponent from 'utils/splitComponent';

import './style.scss';

function Placeholder() {
  return <div>PLACEHOLDER!</div>;
}

const SampleComponent1 = splitComponent({
  chunkName: 'sample-component-a',
  getComponent: () => import(
    /* webpackChunkName: 'sample-component-a' */'./ComponentA'
  ),
});

const SampleComponent2 = splitComponent({
  chunkName: 'sample-component-b',
  getComponent: () => import(
    /* webpackChunkName: 'sample-component-b' */ './ComponentB'
  ),
  placeholder: <Placeholder />,
});

const SampleComponent3 = splitComponent({
  chunkName: 'sample-component-c',
  getComponent: () => import(
    /* webpackChunkName: 'sample-component-c' */ './ComponentC'
  ),
});

export default function SampleCodeSplit() {
  const [testKey] = useGlobalState<1, string>('test.key', 'testValue');
  return (
    <div styleName="container">
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
    </div>
  );
}

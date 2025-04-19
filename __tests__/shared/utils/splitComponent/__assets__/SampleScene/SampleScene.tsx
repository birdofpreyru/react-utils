/**
 * This is a sample component, doing a code split.
 */

import { type ForceT, useGlobalState } from '@dr.pogodin/react-global-state';

import splitComponent from 'utils/splitComponent';

import './style.scss';

const Placeholder: React.FunctionComponent = () => <div>PLACEHOLDER!</div>;

const SampleComponent1 = splitComponent({
  chunkName: 'sample-component-a',
  getComponent: async () => import(
    /* webpackChunkName: 'sample-component-a' */'./ComponentA'
  ),
});

const SampleComponent2 = splitComponent({
  chunkName: 'sample-component-b',
  getComponent: async () => import(
    /* webpackChunkName: 'sample-component-b' */ './ComponentB'
  ),
  placeholder: <Placeholder />,
});

const SampleComponent3 = splitComponent({
  chunkName: 'sample-component-c',
  getComponent: async () => import(
    /* webpackChunkName: 'sample-component-c' */ './ComponentC'
  ),
});

const SampleCodeSplit: React.FunctionComponent = () => {
  const [testKey] = useGlobalState<ForceT, string>('test.key', 'testValue');
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
};

export default SampleCodeSplit;

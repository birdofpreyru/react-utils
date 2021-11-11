/**
 * This is a sample component, doing a code split.
 */

import path from 'path';
import { useGlobalState } from '@dr.pogodin/react-global-state';

import CodeSplit from 'components/CodeSplit';

import { webpack } from 'utils';

function Placeholder() {
  return <div>PLACEHOLDER!</div>;
}

export default function SampleCodeSplit() {
  const [testKey] = useGlobalState('test.key', 'testValue');
  return (
    <>
      <h1>{testKey}</h1>
      <CodeSplit
        chunkName="sample-component-1"
        getComponentAsync={
          () => import(/* webpackChunkName: 'sample-component-1' */ './SampleComponent')
        }
      />
      <CodeSplit
        chunkName="sample-component-2"
        getComponentAsync={
          () => import(/* webpackChunkName: 'sample-component-2' */ './SampleComponent')
        }
        placeholder={Placeholder}
      />
      <CodeSplit
        chunkName="sample-component-3"
        getComponentAsync={
          () => import(/* webpackChunkName: 'sample-component-3' */ './SampleComponent')
        }
        getComponentServer={() => {
          const p = webpack.resolveWeak('./SampleComponent');
          return webpack.requireWeak(path.resolve(__dirname, p));
        }}
        placeholder={Placeholder}
      />
    </>
  );
}

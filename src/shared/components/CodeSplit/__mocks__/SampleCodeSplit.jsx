/**
 * This is a sample component, doing a code split.
 */

import React from 'react';
import path from 'path';

import CodeSplit from 'components/CodeSplit';

import { hooks, webpack } from 'utils';

export default function SampleCodeSplit() {
  const [testKey] = hooks.useGlobalState('test.key', 'testValue');
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
        placeholder={() => <div>PLACEHOLDER!</div>}
      />
      <CodeSplit
        chunkName="sample-component-3"
        getComponentAsync={
          () => import(/* webpackChunkName: 'sample-component-3' */ './SampleComponent')
        }
        getComponentServer={() => {
          const p = webpack.resolveWeak('components/CodeSplit/__mocks__/SampleComponent');
          return webpack.requireWeak(path.resolve(__dirname, p));
        }}
        placeholder={() => <div>PLACEHOLDER!</div>}
      />
    </>
  );
}

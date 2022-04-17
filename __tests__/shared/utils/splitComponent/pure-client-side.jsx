/** @jest-environment jsdom */

// This tests pure client-side rendering from scratch.

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';
import pretty from 'pretty';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-test-renderer';
import { mockClientSide, mount } from 'utils/jest';

test('Pure client-side render', async () => {
  mockClientSide();

  window.TRU_BUILD_INFO = {
    publicPath: '/test/public/path',
  };

  require('client/init');

  window.CHUNK_GROUPS = {
    main: [
      'main-1511941200000.css',
      'main-1511941200000.js',
    ],
    'sample-component-1': [
      'sample-component-1-1511941200000.css',
    ],
    'sample-component-2': [
      'sample-component-2-1511941200000.js',
      'sample-component-2-1511941200000.css',
    ],
    'sample-component-3': [
      'sample-component-3-1511941200000.js',
      'sample-component-3-1511941200000.css',
    ],
  };

  const SampleCodeSplit = require('./__assets__/SampleCodeSplit').default;

  // Note: <BrowserRouter> is needed here because we don't use the client-side
  // initializer here, which would wrap with it automatically.
  const scene = mount(
    <BrowserRouter>
      <GlobalStateProvider>
        <SampleCodeSplit />
      </GlobalStateProvider>
    </BrowserRouter>,
  );

  // Note: this is a working way to wrap async Suspense resolution in component
  // tree within act().
  await act(() => new Promise(process.nextTick));

  // TODO: The current head snapshot is not correct, as misses the actual
  // <link> elements we expect to have.
  expect(pretty(document.head.innerHTML)).toMatchSnapshot();

  expect(pretty(scene.innerHTML)).toMatchSnapshot();

  await act(() => {
    document.head.querySelectorAll('link').forEach((link) => {
      link.onload();
    });
    return new Promise(process.nextTick);
  });

  expect(pretty(scene.innerHTML)).toMatchSnapshot();
});

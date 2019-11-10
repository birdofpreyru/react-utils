/**
 * Here are the actual code splitting tests.
 */

import { StaticRouter } from 'react-router-dom';

import mockdate from 'mockdate';
import pretty from 'pretty';

import { isServerSide } from 'utils/isomorphy';

let GlobalStateProvider;
let React;
let ReactDomServer;
let SampleCodeSplit;

jest.mock('uuid/v4');
jest.useFakeTimers();
mockdate.set('2019-11-29Z');

/**
 * Reproduces the core of server-side rendering setup.
 * @param {Object} Scene
 * @param {Number} [maxRenderRounds=10]
 */
async function renderServerSide(Scene, maxRenderRounds = 10) {
  let markup;
  const ssrContext = {
    req: { url: '/some/path' },
    state: {},
    chunks: [],
    splits: {},
  };
  for (let round = 0; round < maxRenderRounds; round += 1) {
    /* eslint-disable no-await-in-loop */
    ssrContext.chunks = [];
    ssrContext.splits = {};
    markup = ReactDomServer.renderToString((
      <GlobalStateProvider
        initialState={ssrContext.state}
        ssrContext={ssrContext}
      >
        <StaticRouter
          context={ssrContext}
          location={ssrContext.req.url}
        >
          <Scene />
        </StaticRouter>
      </GlobalStateProvider>
    ));
    if (ssrContext.dirty) {
      await Promise.allSettled(ssrContext.pending);
    } else break;
    /* eslint-enable no-await-in-loop */
  }
  return markup;
}

beforeEach(async () => {
  jest.resetModules();
  React = require('react');
  ReactDomServer = require('react-dom/server');
  ({ GlobalStateProvider } = require('@dr.pogodin/react-global-state'));
  SampleCodeSplit = require(
    'components/CodeSplit/__mocks__/SampleCodeSplit',
  ).default;
});

test('Server-side rendring', async () => {
  expect(isServerSide()).toBe(true);
  let markup = await renderServerSide(SampleCodeSplit, 1);
  expect(pretty(markup)).toMatchSnapshot();
  markup = renderServerSide(SampleCodeSplit, 2);
  await jest.runAllTimers();
  markup = await markup;
  expect(pretty(markup)).toMatchSnapshot();
});

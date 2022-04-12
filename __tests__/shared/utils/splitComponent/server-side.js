/**
 * Here are the actual code splitting tests.
 */

import mockdate from 'mockdate';
import pretty from 'pretty';

import { IS_SERVER_SIDE } from 'utils/isomorphy';

import SampleCodeSplit from './__assets__/SampleCodeSplit';
import { RoutingScene1, RoutingScene2 } from './__assets__/RoutingScene';
import { renderServerSide } from './__assets__/shared';

jest.mock('node-forge');
jest.mock('uuid');

mockdate.set('2019-11-29Z');

test('Server-side rendering', async () => {
  expect(IS_SERVER_SIDE).toBe(true);
  let markup = await renderServerSide(SampleCodeSplit, { maxSsrRounds: 1 });
  expect(pretty(markup)).toMatchSnapshot();
  markup = await renderServerSide(SampleCodeSplit, { maxSsrRounds: 3 });
  expect(pretty(markup)).toMatchSnapshot();
});

test('React Router works inside CodeSplit', async () => {
  let markup = await renderServerSide(RoutingScene1, {
    maxSsrRounds: 1,
    url: '/base/hello-world',
  });
  expect(pretty(markup)).toMatchSnapshot();

  markup = await renderServerSide(RoutingScene2, {
    maxSsrRounds: 1,
    url: '/hello-world',
  });
  expect(pretty(markup)).toMatchSnapshot();
});

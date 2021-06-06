/**
 * Here are the actual code splitting tests.
 */

import mockdate from 'mockdate';
import pretty from 'pretty';

import { IS_SERVER_SIDE } from 'utils/isomorphy';

import SampleCodeSplit from './__assets__/SampleCodeSplit';
import { renderServerSide } from './__assets__/shared';

jest.mock('node-forge');
jest.mock('uuid');

jest.useFakeTimers();
mockdate.set('2019-11-29Z');

test('Server-side rendering', async () => {
  expect(IS_SERVER_SIDE).toBe(true);
  let markup = await renderServerSide(SampleCodeSplit, 1);
  expect(pretty(markup)).toMatchSnapshot();
  markup = renderServerSide(SampleCodeSplit, 3);
  jest.runAllTimers();
  markup = await markup;
  expect(pretty(markup)).toMatchSnapshot();
});

import { StatusCodes } from 'http-status-codes';

import { expect, test } from '@jest/globals';

import { fail } from 'server/utils/errors';

test('fail()', () => {
  let error: unknown;
  let never: Error | undefined;
  try {
    never = fail('Mock error', StatusCodes.IM_A_TEAPOT);
  } catch (e: unknown) {
    error = e;
  }
  expect(error).toMatchSnapshot();
  expect((error as { status: number }).status).toBe(418);
  expect(never).toBeUndefined();
});

import { fail } from 'server/utils/errors';

test('fail()', () => {
  let error: any;
  let never: any;
  try {
    never = fail('Mock error', 418);
  } catch (e: any) {
    error = e;
  }
  expect(error).toMatchSnapshot();
  expect(error.status).toBe(418);
  expect(never).toBeUndefined();
});

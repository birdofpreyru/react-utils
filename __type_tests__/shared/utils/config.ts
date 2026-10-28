import { expect, test } from 'tstyche';

import { getConfig } from 'utils';

type T = { key: 'value' };

test('Syncronous config type', () => {
  expect(getConfig<T>(true)).type.toBe<T>();
});

import { expect, test } from '@jest/globals';

import { webpack } from 'utils';

test('resolveWeak', () => {
  expect(webpack.resolveWeak('utils/config')).toMatchSnapshot();
});

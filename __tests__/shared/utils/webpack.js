import { webpack } from 'utils';

test('resolveWeak', () => {
  expect(webpack.resolveWeak('utils/hooks')).toMatchSnapshot();
});

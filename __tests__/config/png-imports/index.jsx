import logoPng from './logo.png';

test('PNG import by Babel', () => {
  expect(logoPng).toMatchSnapshot();
});

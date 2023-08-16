import getConfig from '../../../../config/babel/webpack';

test('Module exports', () => {
  expect(getConfig).toMatchSnapshot();
});

describe('"development" environment', () => {
  const babel = { env: () => 'development' };

  test('Default config', () => {
    expect(getConfig(babel)).toMatchSnapshot();
  });

  test('"noStyling" variation', () => {
    expect(getConfig(babel, { noStyling: true })).toMatchSnapshot();
  });
});

describe('"production" environment', () => {
  const babel = { env: () => 'production' };

  test('Default config', () => {
    expect(getConfig(babel)).toMatchSnapshot();
  });

  test('"noStyling" variation', () => {
    expect(getConfig(babel, { noStyling: true })).toMatchSnapshot();
  });
});

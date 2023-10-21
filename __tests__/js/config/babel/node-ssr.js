import getConfig from '../../../../config/babel/node-ssr';

test('Module exports', () => {
  expect(getConfig).toMatchSnapshot();
});

describe('"development" environment', () => {
  const babel = { env: () => 'development' };

  test('Default config', () => {
    expect(getConfig(babel, { typescript: true })).toMatchSnapshot();
    expect(getConfig(babel)).toMatchSnapshot();
  });

  test('"baseAssetsOutputPath" option', () => {
    expect(getConfig(babel, {
      baseAssetsOutputPath: '/test/path',
      typescript: true,
    })).toMatchSnapshot();
    expect(getConfig(babel, { baseAssetsOutputPath: '/test/path' }))
      .toMatchSnapshot();
  });

  test('"noStyling" variation', () => {
    expect(getConfig(babel, {
      noStyling: true,
      typescript: true,
    })).toMatchSnapshot();
    expect(getConfig(babel, { noStyling: true })).toMatchSnapshot();
  });
});

describe('"production" environment', () => {
  const babel = { env: () => 'production' };

  test('Default config', () => {
    expect(getConfig(babel, { typescript: true })).toMatchSnapshot();
    expect(getConfig(babel)).toMatchSnapshot();
  });

  test('"baseAssetsOutputPath" option', () => {
    expect(getConfig(babel, {
      baseAssetsOutputPath: '/test/path',
      typescript: true,
    })).toMatchSnapshot();
    expect(getConfig(babel, { baseAssetsOutputPath: '/test/path' }))
      .toMatchSnapshot();
  });

  test('"noStyling" variation', () => {
    expect(getConfig(babel, {
      noStyling: true,
      typescript: true,
    })).toMatchSnapshot();
    expect(getConfig(babel, { noStyling: true })).toMatchSnapshot();
  });
});

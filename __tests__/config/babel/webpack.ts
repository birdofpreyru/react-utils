import { describe, expect, test } from '@jest/globals';

import getConfig from '../../../config/babel/webpack';

test('Module exports', () => {
  expect(getConfig).toMatchSnapshot();
});

describe('"development" environment', () => {
  const babel = { env: () => 'development' };

  test('Default config', () => {
    expect(getConfig(babel, { typescript: true })).toMatchSnapshot();
    expect(getConfig(babel)).toMatchSnapshot();
  });

  test('"noReactCompiler" variation', () => {
    expect(getConfig(babel, { noReactCompiler: true })).toMatchSnapshot();
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

  test('"noReactCompiler" variation', () => {
    expect(getConfig(babel, { noReactCompiler: true })).toMatchSnapshot();
  });

  test('"noStyling" variation', () => {
    expect(getConfig(babel, {
      noStyling: true,
      typescript: true,
    })).toMatchSnapshot();
    expect(getConfig(babel, { noStyling: true })).toMatchSnapshot();
  });
});

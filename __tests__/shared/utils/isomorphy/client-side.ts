/** @jest-environment jsdom */

import { afterEach, expect, test } from '@jest/globals';

import { setBuildInfo } from 'utils/isomorphy/buildInfo';
import { mockClientSide } from 'utils/jest';

// TODO: It would be nicer to do all these tests with a proper Webpack build.

mockClientSide();

setBuildInfo({
  key: '',
  publicPath: '',
  timestamp: 'Test build timestamp',
  useServiceWorker: false,
});

afterEach(() => {
  process.env.NODE_ENV = 'test';
});

test('Client-side detection', async () => {
  const { IS_CLIENT_SIDE, IS_SERVER_SIDE } = await import('utils/isomorphy');
  expect(IS_CLIENT_SIDE).toBe(true);
  expect(IS_SERVER_SIDE).toBe(false);
});

test('Dev mode detection - client side', async () => {
  process.env.NODE_ENV = 'development';
  const { isDevBuild, isProdBuild } = await import('utils/isomorphy');
  expect(isDevBuild()).toBe(true);
  expect(isProdBuild()).toBe(false);
});

test('Prod mode - client side', async () => {
  process.env.NODE_ENV = 'production';
  const { isDevBuild, isProdBuild } = await import('utils/isomorphy');
  expect(isDevBuild()).toBe(false);
  expect(isProdBuild()).toBe(true);
});

test('Build timestamp - client-side', async () => {
  const { buildTimestamp } = await import('utils/isomorphy');
  expect(buildTimestamp()).toBe('Test build timestamp');
});

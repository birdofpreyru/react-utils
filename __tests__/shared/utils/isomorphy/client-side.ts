/** @jest-environment jsdom */

import { mockClientSide } from 'utils/jest';
import { setBuildInfo } from 'utils/isomorphy/buildInfo';

import type * as IT from 'utils/isomorphy';

// TODO: It would be nicer to do all these tests with a proper Webpack build.

mockClientSide();

setBuildInfo({
  key: '',
  publicPath: '',
  timestamp: 'Test build timestamp',
  useServiceWorker: false,
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const m = require('utils/isomorphy') as typeof IT;

afterEach(() => {
  process.env.NODE_ENV = 'test';
});

test('Client-side detection', () => {
  expect(m.IS_CLIENT_SIDE).toBe(true);
  expect(m.IS_SERVER_SIDE).toBe(false);
});

test('Dev mode detection - client side', () => {
  process.env.NODE_ENV = 'development';
  expect(m.isDevBuild()).toBe(true);
  expect(m.isProdBuild()).toBe(false);
});

test('Prod mode - client side', () => {
  process.env.NODE_ENV = 'production';
  expect(m.isDevBuild()).toBe(false);
  expect(m.isProdBuild()).toBe(true);
});

test('Build timestamp - client-side', () => {
  expect(m.buildTimestamp()).toBe('Test build timestamp');
});

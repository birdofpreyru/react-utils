/* Helper for loading of tested module. */

import { mockClientSide, unmockClientSide } from 'utils/jest';

const m = () => require('utils/isomorphy');

afterEach(() => {
  delete global.TRU_BUILD_INFO;
  delete window.TRU_BUILD_INFO;
  delete process.env.BABEL_ENV;
  process.env.NODE_ENV = 'test';
  unmockClientSide();
});

beforeEach(() => jest.resetModules());

test('Client-side detection', () => {
  mockClientSide();
  expect(m().IS_CLIENT_SIDE).toBe(true);
  expect(m().IS_SERVER_SIDE).toBe(false);
});

test('Server-side detection', () => {
  expect(m().IS_CLIENT_SIDE).toBe(false);
  expect(m().IS_SERVER_SIDE).toBe(true);
});

test('Dev mode detection - client side', () => {
  process.env.NODE_ENV = 'development';
  mockClientSide();
  expect(m().isDevBuild()).toBe(true);
  expect(m().isProdBuild()).toBe(false);
});

test('Dev mode detection - server side', () => {
  process.env.NODE_ENV = 'development';
  expect(m().isDevBuild()).toBe(true);
  expect(m().isProdBuild()).toBe(false);
});

test('Prod mode - client side', () => {
  process.env.NODE_ENV = 'production';
  mockClientSide();
  expect(m().isDevBuild()).toBe(false);
  expect(m().isProdBuild()).toBe(true);
});

test('Prod mode - server side', () => {
  process.env.NODE_ENV = 'production';
  expect(m().isDevBuild()).toBe(false);
  expect(m().isProdBuild()).toBe(true);
});

test('Build timestamp - client-side', () => {
  window.TRU_BUILD_INFO = { timestamp: 'Test build timestamp' };
  mockClientSide();
  expect(m().buildTimestamp()).toBe('Test build timestamp');
});

test('Build timestamp - server-side', () => {
  global.TRU_BUILD_INFO = { timestamp: 'Test build timestamp' };
  expect(m().IS_CLIENT_SIDE).toBe(false);
  expect(m().buildTimestamp()).toBe('Test build timestamp');
});

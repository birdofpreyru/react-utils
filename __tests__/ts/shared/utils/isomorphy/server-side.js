import { setBuildInfo } from 'utils/isomorphy/buildInfo';

const m = require('utils/isomorphy');

setBuildInfo({ timestamp: 'Test build timestamp' });

afterEach(() => {
  process.env.NODE_ENV = 'test';
});

test('Server-side detection', () => {
  expect(m.IS_CLIENT_SIDE).toBe(false);
  expect(m.IS_SERVER_SIDE).toBe(true);
});

test('Dev mode detection', () => {
  process.env.NODE_ENV = 'development';
  expect(m.isDevBuild()).toBe(true);
  expect(m.isProdBuild()).toBe(false);
});

test('Prod mode', () => {
  process.env.NODE_ENV = 'production';
  expect(m.isDevBuild()).toBe(false);
  expect(m.isProdBuild()).toBe(true);
});

test('Build timestamp', () => {
  expect(m.buildTimestamp()).toBe('Test build timestamp');
});

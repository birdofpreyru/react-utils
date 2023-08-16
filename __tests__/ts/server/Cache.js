/**
 * Testing Cache object.
 */

import mockdate from 'mockdate';
import Cache from 'server/Cache';

mockdate.set('2021-04-05Z');

it('works as expected', () => {
  const cache = new Cache(9);
  expect(cache).toMatchSnapshot();
  cache.add('123', 'A');
  mockdate.set(Date.now() + 1000);
  cache.add('123456', 'B');
  mockdate.set(Date.now() + 1000);
  expect(cache).toMatchSnapshot();
  cache.add('ab', 'A');
  mockdate.set(Date.now() + 1000);
  expect(cache).toMatchSnapshot();
  expect(cache.get({ key: 'C' })).toBe(null);
  expect(cache.get({ key: 'A' })).toBe('ab');
  expect(cache.get({ key: 'A', maxage: 0 })).toBe(null);
  cache.add('21', 'C');
  expect(cache).toMatchSnapshot();
});

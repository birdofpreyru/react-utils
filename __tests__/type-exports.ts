import { expect } from 'tstyche';

import type {
  BeforeRenderResT,
  BeforeRenderT,
  ConfigT,
  ServerSsrContext,
  ServerT,
} from '../src';

test('type exports', () => {
  expect<BeforeRenderResT>().type.toBe<BeforeRenderResT>();
  expect<BeforeRenderT>().type.toBe<BeforeRenderT>();
  expect<ConfigT>().type.toBe<ConfigT>();
  expect<ServerSsrContext<unknown>>().type.toBe<ServerSsrContext<unknown>>();
  expect<ServerT>().type.toBe<ServerT>();
});

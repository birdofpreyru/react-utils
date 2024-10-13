import { expect } from 'tstyche';

import {
  type BeforeRenderResT,
  type BeforeRenderT,
  type ConfigT,
  type ServerT,
} from '../src';

test('type exports', () => {
  expect<BeforeRenderResT>().type.toBe<BeforeRenderResT>();
  expect<BeforeRenderT>().type.toBe<BeforeRenderT>();
  expect<ConfigT>().type.toBe<ConfigT>();
  expect<ServerT>().type.toBe<ServerT>();
});

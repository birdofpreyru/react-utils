// Checks assumptions about TypeScript compiler behavior.

import { expect } from 'tstyche';

test('array element types', () => {
  const array: number[] = [1];
  expect(array[1]).type.toBe<number | undefined>();
});

test('object field types', () => {
  const object: { [key: string]: string } = {};
  expect(object.field).type.toBe<string | undefined>();
});

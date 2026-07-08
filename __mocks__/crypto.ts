export * from 'node:crypto';

export function randomBytes(numBytes: number): Buffer {
  const res = Buffer.alloc(numBytes);

  // @ts-expect-error "Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature."
  if (global.mockFailsForgeRandomGetBytesMethod) {
    throw Error('Emulated Failure of forge.random.getBytes(..)');
  }

  for (let i = 0; i < numBytes; i += 1) res[i] = i % 10;

  return res;
}

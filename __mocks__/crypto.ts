// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const real = jest.requireActual('node:crypto');

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
real.randomBytes = (
  numBytes: number,
) => {
  const res = Buffer.alloc(numBytes);

  // @ts-expect-error "Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature."
  if (global.mockFailsForgeRandomGetBytesMethod) {
    throw Error('Emulated Failure of forge.random.getBytes(..)');
  }

  for (let i = 0; i < numBytes; i += 1) res[i] = i % 10;

  return res;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = real;

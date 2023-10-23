/* global jest */

const mock = jest.requireActual('node-forge');

declare module global {
  let mockFailsForgeRandomGetBytesMethod: boolean | undefined;
}

mock.random.getBytes = (numBytes: number, cb: (e: Error | null, res?: string) => void) => {
  if (global.mockFailsForgeRandomGetBytesMethod) {
    cb(Error('Emulated Failure of forge.random.getBytes(..)'));
  }
  let res = '';
  for (let i = 0; i < numBytes; i += 1) res += i % 10;
  cb(null, res);
};

export default mock;

/* global jest */

const mock = jest.requireActual('node-forge');

mock.random.getBytes = (numBytes, cb) => {
  if (global.mockFailsForgeRandomGetBytesMethod) {
    cb(Error('Emulated Failure of forge.random.getBytes(..)'));
  }
  let res = '';
  for (let i = 0; i < numBytes; i += 1) res += i % 10;
  cb(null, res);
};

module.exports = mock;

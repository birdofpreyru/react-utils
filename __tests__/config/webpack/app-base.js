import fs from 'fs';
import time from 'utils/time';

let configFactory;

beforeAll(() => {
  fs.writeFileSync = jest.fn();
  configFactory = require('../../../config/webpack/app-base');
});

describe('.build-info output', () => {
  test('Timestamp matches Webpack config', () => {
    const config = configFactory({ context: '/mock/context/path' });
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const buildInfo = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const timestamp = time(buildInfo.timestamp).valueOf();
    expect(`[name]-${timestamp}.js`).toBe(config.output.filename);
  });
});

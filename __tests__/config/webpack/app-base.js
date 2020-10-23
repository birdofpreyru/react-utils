import fs from 'fs';

let configFactory;

beforeAll(() => {
  fs.writeFileSync = jest.fn();
  configFactory = require('../../../config/webpack/app-base');
});

describe('.build-info output', () => {
  test('Timestamp matches Webpack config', () => {
    const config = configFactory({ context: '/mock/context/path' });
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect('[contenthash].js').toBe(config.output.filename);
  });
});

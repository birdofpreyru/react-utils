import { createFsFromVolume, Volume } from 'memfs';
import configFactory from '../../../../config/webpack/app-base';

describe('.build-info output', () => {
  test('Timestamp matches Webpack config', () => {
    const fs = createFsFromVolume(new Volume());
    const context = '/mock/context/path';
    const config = configFactory({ context, fs });
    expect(fs.existsSync(`${context}/.build-info`)).toBe(true);
    expect('[contenthash].js').toBe(config.output.filename);
  });
});

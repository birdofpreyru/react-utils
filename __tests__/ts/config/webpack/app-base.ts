import { createFsFromVolume, Volume } from 'memfs';
import configFactory from '../../../../config/webpack/app-base';

describe('.build-info output', () => {
  test('Timestamp matches Webpack config', () => {
    const fs = createFsFromVolume(new Volume()) as any;
    const context = '/mock/context/path';
    const config = configFactory({
      babelEnv: 'test',
      context,
      entry: '',
      fs,
      mode: 'none',
    });
    expect(fs.existsSync(`${context}/.build-info`)).toBe(true);
    expect('[contenthash].js').toBe(config.output!.filename);
  });
});

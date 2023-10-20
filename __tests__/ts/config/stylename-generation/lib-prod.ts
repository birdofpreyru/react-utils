/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.js
 * @webpack-config-factory ./config/webpack/lib-production.js
 * @webpack-config-options { "entry": "./__assets__/index.js" }
 * @no-ssr true
 */

import { global } from 'src/shared/utils/jest/E2eSsrEnv';

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig.output.path;

it('emits expected CSS', () => {
  const css = fs?.readFileSync(`${outputPath}/style.css`, 'utf8');
  expect(css).toMatchSnapshot();
});

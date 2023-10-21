/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/lib-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index",
 *  "typescript": true }
 * @no-ssr true
 */

import { getGlobal } from 'utils/jest';

const global = getGlobal();

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig!.output!.path;

it('emits expected CSS', () => {
  const css = fs?.readFileSync(`${outputPath}/style.css`, 'utf8');
  expect(css).toMatchSnapshot();
});

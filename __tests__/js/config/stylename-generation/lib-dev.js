/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/lib-development.js
 * @webpack-config-options { "entry": "./__assets__/index.js" }
 * @no-ssr true
 */

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig.output.path;

it('emits expected CSS', () => {
  const css = fs.readFileSync(`${outputPath}/style.css`, 'utf8');
  expect(css).toMatchSnapshot();
});

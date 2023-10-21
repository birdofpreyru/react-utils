/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/Scene404/index.js",
 *  "typescript": true }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/Scene404/Scene.jsx" }
 */

it('exposes 404 status to the test environment', () => {
  expect(global.ssrStatus).toBe(404);
});

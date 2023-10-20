/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/EmptyScene/index.ts" }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/EmptyScene/Scene.tsx" }
 */

it('exposes 200 status to the test environment', () => {
  expect((global as any).ssrStatus).toBe(200);
});

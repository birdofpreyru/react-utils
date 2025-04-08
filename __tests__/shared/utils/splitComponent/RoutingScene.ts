/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/RoutingScene",
 *  "dontUseHmr": true,
 *  "dontUseReactGlobalStateDebugging": true,
 *  "typescript": true }
 * @ssr-options {
 *  "entry": "./__assets__/RoutingScene/RoutingScene.tsx",
 *  "entryExportName": "RoutingScene1" }
 * @ssr-request { "url": "/base/hello-world" }
 */

import pretty from 'pretty';
import { act } from 'react';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

const outputPath = global.webpackConfig!.output!.path;

document.write(global.ssrMarkup!);

const INJ_REGEX = /<meta itemprop="drpruinj" content="[a-zA-Z0-9+/=]+">/;

let headMarkupWithoutInj: string;

it('generates expected head markup during SSR', () => {
  // TODO: Should be improved, to ensure the injection part is the same between
  // test invocations, and thus entire header can be snapshotted.
  const headMarkup = document.head.innerHTML;
  const inj = document.querySelector('meta[itemprop="drpruinj"]')!.outerHTML;
  expect(!!inj.match(INJ_REGEX)).toBe(true);
  headMarkupWithoutInj = headMarkup.replace(inj, '');
  expect(pretty(headMarkupWithoutInj)).toMatchSnapshot();
});

it('generates expected markup during SSR', () => {
  // TODO: It was done this way when document body contained server-side
  // injected data, which changed between test invocations. Now they are moved
  // to the header (see a comment above), thus this can be simplified:
  // snapshot entire body, or better ensure injected data do not change
  // between test invocations, and snapshot entire document.
  const container = document.querySelector('#react-view')!;
  expect(pretty(container.innerHTML)).toMatchSnapshot();
});

it('hydration works as expected', async () => {
  const viewMarkup = document.querySelector('#react-view')!.innerHTML;

  const fs = global.webpackOutputFs;

  const chunks = global.webpackStats!.namedChunkGroups!;

  const mainJs = fs.readFileSync(
    `${outputPath}/${chunks.main!.assets![0]!.name}`,
    'utf8',
  ) as string;

  const splitJs = fs.readFileSync(
    `${outputPath}/${chunks.split!.assets![0]!.name}`,
    'utf8',
  ) as string;

  /* eslint-disable @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
  await act(() => new Function(mainJs)());
  await act(() => new Function(splitJs)());
  /* eslint-enable @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */

  expect(document.head.innerHTML).toBe(headMarkupWithoutInj);
  expect(document.querySelector('#react-view')!.innerHTML).toBe(viewMarkup);
});

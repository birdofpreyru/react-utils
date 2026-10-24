/**
 * @jest-environment ./build/production/shared/utils/jest/E2eSsrEnv
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

import { expect, test } from '@jest/globals';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

const outputPath = global.webpackConfig?.output?.path;
if (!outputPath) throw Error('Missing output path');

if (!global.ssrMarkup) throw Error('Missing SSR markup');
document.write(global.ssrMarkup);

const INJ_REGEX = /<meta itemprop="drpruinj" content="[a-zA-Z0-9+/=]+">/;

let headMarkupWithoutInj: string;

test('generates expected head markup during SSR', () => {
  // TODO: Should be improved, to ensure the injection part is the same between
  // test invocations, and thus entire header can be snapshotted.
  const headMarkup = document.head.innerHTML;
  const inj = document.querySelector('meta[itemprop="drpruinj"]')?.outerHTML;
  if (!inj) throw Error('Missing injection');
  expect(!!inj.match(INJ_REGEX)).toBe(true);
  headMarkupWithoutInj = headMarkup.replace(inj, '');
  expect(pretty(headMarkupWithoutInj)).toMatchSnapshot();
});

test('generates expected markup during SSR', () => {
  // TODO: It was done this way when document body contained server-side
  // injected data, which changed between test invocations. Now they are moved
  // to the header (see a comment above), thus this can be simplified:
  // snapshot entire body, or better ensure injected data do not change
  // between test invocations, and snapshot entire document.
  const container = document.querySelector('#react-view');
  if (!container) throw Error('Missing container');
  expect(pretty(container.innerHTML)).toMatchSnapshot();
});

test('hydration works as expected', async () => {
  const viewMarkup = document.querySelector('#react-view')?.innerHTML;
  if (!viewMarkup) throw Error('Missing view markup');

  const fs = global.webpackOutputFs;

  const chunks = global.webpackStats?.namedChunkGroups;
  if (!chunks) throw Error('Missing chunks');

  const jsMainFile = chunks.main?.assets?.[0]?.name;
  if (!jsMainFile) throw Error('Missing main JS file name');
  const mainJs = fs.readFileSync(
    `${outputPath}/${jsMainFile}`,
    'utf8',
  ) as string;

  const jsSplitFile = chunks.split?.assets?.[0]?.name;
  if (!jsSplitFile) throw Error('Missing split JS file name');
  const splitJs = fs.readFileSync(
    `${outputPath}/${jsSplitFile}`,
    'utf8',
  ) as string;

  await act(async () => {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    new Function(mainJs)();
    await SCENE_INIT_PROMISE;
  });
  await act(async () => {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    new Function(splitJs)();
    await SCENE_INIT_PROMISE;
  });

  expect(document.head.innerHTML).toBe(headMarkupWithoutInj);

  const finalMarkup = document.querySelector('#react-view')?.innerHTML;
  expect(finalMarkup).toBe(viewMarkup);
});

/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-development.js
 * @webpack-config-options {
 *  "entry": "./__assets__/SampleScene",
 *  "dontUseHmr": true,
 *  "dontUseReactGlobalStateDebugging": true,
 *  "typescript": true }
 * @ssr-options { "entry": "./__assets__/SampleScene/SampleScene" }
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
  const mainJs = fs.readFileSync(`${outputPath}/main.js`, 'utf8') as string;
  const aJs = fs.readFileSync(`${outputPath}/sample-component-a.js`, 'utf8') as string;
  const bJs = fs.readFileSync(`${outputPath}/sample-component-b.js`, 'utf8') as string;
  const cJs = fs.readFileSync(`${outputPath}/sample-component-c.js`, 'utf8') as string;

  await act(() => new Function(mainJs)()); // eslint-disable-line no-new-func
  await act(() => new Function(aJs)()); // eslint-disable-line no-new-func
  await act(() => new Function(bJs)()); // eslint-disable-line no-new-func
  await act(() => new Function(cJs)()); // eslint-disable-line no-new-func

  expect(document.head.innerHTML).toBe(headMarkupWithoutInj);
  expect(document.querySelector('#react-view')!.innerHTML).toBe(viewMarkup);
});

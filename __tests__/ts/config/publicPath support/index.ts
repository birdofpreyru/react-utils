/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index.ts",
 *  "publicPath": "/public/path" }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/Scene.tsx",
 *  "root": "TEST" }
 */

import pretty from 'pretty';
import { act } from 'react-dom/test-utils';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

const { path: outPath, publicPath } = global.webpackConfig!.output!;

const baseUrl = `http://localhost${publicPath}`;

const fs = global.webpackOutputFs;

document.write(global.ssrMarkup || '');

const { assetsByChunkName, errors } = global.webpackStats || {};

let jsFileName: string;
let cssFileName: string;
assetsByChunkName?.main.forEach((name) => {
  if (name.endsWith('.css')) cssFileName = name;
  else if (name.endsWith('.js')) jsFileName = name;
});

it('completes Webpack build without errors', () => {
  expect(errors).toEqual([]);
});

it('relies on the expected base URL', () => {
  expect(baseUrl).toMatchSnapshot();
});

it('generates expected view', () => {
  const markup = document.querySelector('#react-view')?.innerHTML;
  expect(pretty(markup || '')).toMatchSnapshot();
});

it('matches SSR markup in hydration', async () => {
  const inj = document.querySelector('meta[itemprop="drpruinj"]')?.outerHTML;
  const ssrMarkup = document.documentElement.innerHTML.replace(inj || '', '');
  const js = fs?.readFileSync(`${outPath}/${jsFileName}`, 'utf8') as string;
  await act(() => new Function(js)()); // eslint-disable-line no-new-func
  expect(document.documentElement.innerHTML).toBe(ssrMarkup);
});

it('uses the correct JS bundle URL', () => {
  const element = document.querySelector(
    '[type="application/javascript"]',
  ) as HTMLScriptElement;
  expect(element.src).toBe(`${baseUrl}${jsFileName}`);
});

it('uses the correct CSS URL', () => {
  const element = document.querySelector(
    '[rel="stylesheet"]',
  ) as HTMLLinkElement;
  expect(element.href).toBe(`${baseUrl}${cssFileName}`);
});

it('uses the correct PNG URL', () => {
  const element = document.querySelector('[alt="Empty PNG"]') as HTMLImageElement;
  expect(element.src.startsWith(baseUrl)).toBe(true);
  const path = `${outPath}/${element.src.slice(baseUrl.length)}`;
  expect(fs?.existsSync(path)).toBe(true);
});

it('emits correct CSS', () => {
  const css = fs?.readFileSync(`${outPath}/${cssFileName}`, 'utf8') as string;
  expect(css).toMatchSnapshot();
  let ttfUrl = css.match(/src:url\((.*)\.ttf\)/)?.[1];
  ttfUrl = `http://localhost${ttfUrl}.ttf`;
  expect(ttfUrl.startsWith(baseUrl)).toBe(true);
  const path = `${outPath}/${ttfUrl.slice(baseUrl.length)}`;
  expect(fs?.existsSync(path)).toBe(true);
});

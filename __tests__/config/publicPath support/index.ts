/**
 * @jest-environment ./build/production/shared/utils/jest/E2eSsrEnv
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index.ts",
 *  "publicPath": "/public/path",
 *  "typescript": true }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/Scene.tsx",
 *  "root": "TEST" }
 */

import pretty from 'pretty';
import { act } from 'react';

import { expect, it } from '@jest/globals';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

if (!global.webpackConfig?.output) throw Error('Missing output config');
const { path: outPath, publicPath } = global.webpackConfig.output;
if (!outPath) throw Error('Missing output path');

const baseUrl = `http://localhost${publicPath as string}`;

const fs = global.webpackOutputFs;

document.write(global.ssrMarkup ?? '');

const { assetsByChunkName, errors } = global.webpackStats ?? {};

let jsFileName: string;
let cssFileName: string;
assetsByChunkName?.main?.forEach((name) => {
  if (name.endsWith('.css')) cssFileName = name;
  else if (name.endsWith('.js')) jsFileName = name;
});

it('completes Webpack build without errors', () => {
  expect(errors).toStrictEqual([]);
});

it('relies on the expected base URL', () => {
  expect(baseUrl).toMatchSnapshot();
});

it('generates expected view', () => {
  const markup = document.querySelector('#react-view')?.innerHTML;
  if (!markup) throw Error('Missing mark-up');
  expect(pretty(markup)).toMatchSnapshot();
});

it('matches SSR markup in hydration', async () => {
  const inj = document.querySelector('meta[itemprop="drpruinj"]')?.outerHTML;
  if (!inj) throw Error('Missing injection');
  const ssrMarkup = document.documentElement.innerHTML.replace(inj, '');
  const js = fs.readFileSync(`${outPath}/${jsFileName}`, 'utf8') as string;

  await act(async () => {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    new Function(js)();
    await SCENE_INIT_PROMISE;
  });

  expect(document.documentElement.innerHTML).toBe(ssrMarkup);
});

it('uses the correct JS bundle URL', () => {
  const element = document.querySelector<HTMLScriptElement>(
    '[type="application/javascript"]',
  );
  expect(element?.src).toBe(`${baseUrl}${jsFileName}`);
});

it('uses the correct CSS URL', () => {
  const element = document.querySelector<HTMLLinkElement>(
    '[rel="stylesheet"]',
  );
  expect(element?.href).toBe(`${baseUrl}${cssFileName}`);
});

it('uses the correct PNG URL', () => {
  const element = document.querySelector<HTMLImageElement>('[alt="Empty PNG"]');
  expect(element?.src.startsWith(baseUrl)).toBe(true);
  const file = element?.src.slice(baseUrl.length);
  if (!file) throw Error('Missing file name');
  const path = `${outPath}/${file}`;
  expect(fs.existsSync(path)).toBe(true);
});

it('emits correct CSS', () => {
  const css = fs.readFileSync(`${outPath}/${cssFileName}`, 'utf8') as string;
  expect(css).toMatchSnapshot();
  let ttfUrl = css.match(/src:url\((.*)\.ttf\)/)?.[1];
  if (!ttfUrl) throw Error('Missing TTF URL.');
  ttfUrl = `http://localhost${ttfUrl}.ttf`;
  expect(ttfUrl.startsWith(baseUrl)).toBe(true);
  const path = `${outPath}/${ttfUrl.slice(baseUrl.length)}`;
  expect(fs.existsSync(path)).toBe(true);
});

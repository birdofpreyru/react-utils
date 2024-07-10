/* global jest, document */
/* eslint-disable import/no-extraneous-dependencies */

import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import mockdate from 'mockdate';
import { type ReactNode, act } from 'react';
import { type Root, createRoot } from 'react-dom/client';

import { type RenderResult, render } from '@testing-library/react';

/**
 * An alias for [act(..)](https://reactjs.org/docs/test-utils.html#act)
 * from `react`.
 */
export { act };

export { default as getGlobal } from './global';

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

global.IS_REACT_ACT_ENVIRONMENT = true;

const originalProcessVersions = process.versions;

/**
 * Tricks **react-utils** into thinking the test is running within client-side
 * (browser) environment.
 */
export function mockClientSide() {
  Object.defineProperty(process, 'versions', { value: null });
}

/**
 * Reverts the effect of {@link module:JU.mockClientSide mockClientSide(..)}.
 */
export function unmockClientSide() {
  Object.defineProperty(process, 'versions', {
    value: originalProcessVersions,
    writable: false,
  });
}

/**
 * Generates a mock UUID, or better said it determenistically transforms given
 * `seed` number into a UUID-formatted string.
 * @param {number} seed
 * @return {string}
 */
export function getMockUuid(seed = 0) {
  const x = seed.toString(16).padStart(32, '0');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

export type AxiosRequestHandlerT =
  (config: AxiosRequestConfig) => Partial<AxiosResponse> | null | undefined;

export function mockAxios(handlers: AxiosRequestHandlerT[]) {
  const axios = jest.requireActual('axios');

  axios.defaults.adapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
    for (let i = 0; i < handlers.length; ++i) {
      const res = handlers[i]?.(config);
      if (res) {
        return {
          config: config as InternalAxiosRequestConfig,
          data: null,
          headers: {},
          status: 200,
          statusText: 'OK',
          ...res,
        };
      }
    }

    // Fallback to the regular network request.
    const res = await axios({ ...config, adapter: ['xhr', 'http', 'fetch'] });

    console.warn(
      'Network request has not been mocked for a test.\n\nConfig:\n',
      config,
      '\n\nResult:\n',
      JSON.stringify(res, null, 2),
    );

    return res;
  };

  return axios;
}

/**
 * Advances mock timers, and mock date by the specified time.
 * @param {number} time Time step [ms].
 * @returns {Promise} Wait for this to "jump after" any async code which should
 * be executed because of the mock time movement.
 */
export async function mockTimer(time: number) {
  mockdate.set(time + Date.now());
  jest.advanceTimersByTime(time);
}

export type MountedSceneT = HTMLElement & {
  destroy: () => void;
  snapshot: () => void;
};

/**
 * Mounts `scene` to the DOM, and returns the root scene element.
 * @param scene
 * @return Created container DOM element with destroy() function
 *  attached.
 */
export function mount(scene: ReactNode): MountedSceneT {
  let root: Root;
  const element = document.createElement('div');
  document.body.appendChild(element);

  const res: MountedSceneT = (element as unknown) as MountedSceneT;
  res.destroy = () => {
    // NOTE: As it seems @testing-library may reset this flag to false
    // when it is simulating user events.
    global.IS_REACT_ACT_ENVIRONMENT = true;

    act(() => root.unmount());
    res.remove();
  };

  res.snapshot = () => {
    expect(res).toMatchSnapshot();
  };

  // NOTE: As it seems @testing-library may reset this flag to false
  // when it is simulating user events.
  global.IS_REACT_ACT_ENVIRONMENT = true;

  act(() => {
    root = createRoot(res);
    root.render(scene);
  });
  return res;
}

type SnapshotOptionsT = {
  await?: Promise<void>;
};

export async function snapshot(
  element: React.ReactElement,
  options?: SnapshotOptionsT,
) {
  let res: RenderResult | undefined;

  const promise = act(() => {
    res = render(element);
    return options?.await;
  });

  if (res === undefined) throw Error('Render failed');
  if (options?.await) await promise;

  const nodes = res.asFragment().childNodes;
  expect(nodes.length > 1 ? [...nodes] : nodes[0]).toMatchSnapshot();
  return res;
}

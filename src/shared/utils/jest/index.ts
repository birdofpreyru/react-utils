/* global jest, document */
/* eslint-disable import/no-extraneous-dependencies */

import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosStatic,
  InternalAxiosRequestConfig,
} from 'axios';

import mockdate from 'mockdate';
import { type ReactElement, type ReactNode, act } from 'react';
import { type Root, createRoot } from 'react-dom/client';

import { type RenderResult, render } from '@testing-library/react';

/**
 * An alias for [act(..)](https://reactjs.org/docs/test-utils.html#act)
 * from `react`.
 */
export { act };

export { default as getGlobal } from './global';

global.IS_REACT_ACT_ENVIRONMENT = true;

const originalProcessVersions = process.versions;

/**
 * Tricks **react-utils** into thinking the test is running within client-side
 * (browser) environment.
 */
export function mockClientSide(): void {
  Object.defineProperty(process, 'versions', { value: undefined });
}

/**
 * Reverts the effect of {@link module:JU.mockClientSide mockClientSide(..)}.
 */
export function unmockClientSide(): void {
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
export function getMockUuid(seed = 0): string {
  const x = seed.toString(16).padStart(32, '0');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

export type AxiosRequestHandlerT = (
  config: AxiosRequestConfig,
) => Partial<AxiosResponse> | null | undefined;

export function mockAxios(handlers: AxiosRequestHandlerT[]): AxiosStatic {
  const axios: AxiosStatic = jest.requireActual('axios');

  axios.defaults.adapter = async (
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse> => {
    for (const handler of handlers) {
      const res = handler(config);
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
    let res: AxiosResponse;
    try {
      res = await axios({ ...config, adapter: ['xhr', 'http', 'fetch'] });
      // eslint-disable-next-line no-console
      console.warn(
        'Network request has not been mocked for a test.\n\nConfig:\n',
        config,
        '\n\nResult:\n',
        JSON.stringify(res, null, 2),
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        'Network request has not been mocked for a test, and failed.\n\nConfig:\n',
        config,
        '\n\nError\n',
        JSON.stringify(e, null, 2),
      );
      throw e;
    }

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
export async function mockTimer(time: number): Promise<void> {
  mockdate.set(time + Date.now());
  await jest.advanceTimersByTimeAsync(time);
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

    act(() => {
      root.unmount();
    });
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

// NOTE: If in future we have additional options here, they should be distributed
// across two objects, depending whether they are applicable to the sync, or async
// versions of snapshot(), or both.
type AsyncSnapshotOptionsT = {
  await?: Promise<void>;
};

export function snapshot(element: ReactElement): RenderResult;

export async function snapshot(
  element: ReactElement,
  options: AsyncSnapshotOptionsT,
): Promise<RenderResult>;

export function snapshot(
  element: React.ReactElement,
  options?: AsyncSnapshotOptionsT,
): Promise<RenderResult> | RenderResult {
  let res: RenderResult | undefined;

  // TODO: Just adding async to the actor function breaks stuff, as it makes
  // act() asynchronous no matter the `options.await` value, thus breaking all
  // calls that do not await for snapshot() result... thus... perhaps we need
  // to have a more complex typing to ensure it all works as intended in all
  // cases, and while being correctly enforced by TypeScript.
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const promise = act(() => {
    res = render(element);
    return options?.await;
  });

  if (res === undefined) throw Error('Render failed');
  if (options?.await) {
    // BEWARE: Although `promise` is thenable (i.e. it has .then() method),
    // it is not an instance of proper Promise class, and returning it directly
    // breaks some async logic in Jest test or React test functions... thus, we
    // wrap it into Promise instance here.
    return new Promise((resolve) => {
      void promise.then(() => {
        // TODO: These lines are the same as the lines below for sync variant of
        // the function. We should split and reuse them in both places.
        const nodes = res!.asFragment().childNodes;
        expect(nodes.length > 1 ? [...nodes] : nodes[0]).toMatchSnapshot();
        resolve(res!);
      });
    });
  }

  const nodes = res.asFragment().childNodes;
  expect(nodes.length > 1 ? [...nodes] : nodes[0]).toMatchSnapshot();
  return res;
}

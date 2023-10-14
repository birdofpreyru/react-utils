/* global expect, jest, document */
/* eslint-disable import/no-extraneous-dependencies */

import mockdate from 'mockdate';
import { type ReactElement, type ReactNode } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import TU, { act } from 'react-dom/test-utils';

/* eslint-disable import/no-extraneous-dependencies */
import Renderer from 'react-test-renderer';
import { type ShallowRenderer, createRenderer } from 'react-test-renderer/shallow';
/* eslint-enable import/no-extraneous-dependencies */

/**
 * An alias for [act(..)](https://reactjs.org/docs/test-utils.html#act)
 * from `react-dom/test-utils`.
 * @param {function} action
 */
export { act };

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

type MountedSceneT = HTMLElement & {
  destroy: () => void;
};

/**
 * Mounts `scene` to the DOM, and returns the root scene element.
 * @param {React.ReactNode} scene
 * @return Created container DOM element with destroy() function
 *  attached.
 */
export function mount(scene: ReactNode): MountedSceneT {
  let root: Root;
  const element = document.createElement('div');
  document.body.appendChild(element);

  const res: MountedSceneT = (element as unknown) as MountedSceneT;
  res.destroy = () => {
    act(() => root.unmount());
    res.remove();
  };

  act(() => {
    root = createRoot(res);
    root.render(scene);
  });
  return res;
}

/* OLD STUFF BELOW THIS MARK */

/**
 * Renders provided ReactJS component into JSON representation of the component
 * tree, using [`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer).
 * @param {object} component ReactJS component to render.
 * @return {object} JSON representation of the rendered tree.
 * @example
 * import { JU } from '@dr.pogodin/react-utils';
 * console.log(JU.render(<div>Example</div>));
 */
export function render(component: ReactElement) {
  return Renderer.create(component).toJSON();
}

/**
 * Generates a shallow render of given ReactJS component, using
 * [react-test-renderer/shallow](https://reactjs.org/docs/shallow-renderer.html)
 * and returns the result.
 * @param {object} component ReactJS component to render.
 * @return {object} JSON representation of the shallow component's render tree.
 */
export function shallowRender(component: ReactElement) {
  const renderer: ShallowRenderer = createRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}

/**
 * Makes a shallow snapshot test of the given ReactJS component, and also
 * returns JSON representation of the rendered component tree. Under the hood
 * it uses {@link module:JU.shallowRender shallowRender(..)} to generate
 * the render, then executes `expect(RENDER_RESULT).toMatchSnapshot()`,
 * and finally returns the `RENDER_RESULT` to the caller.
 * @param {object} component ReactJS component to render.
 * @return {object} JSON representation of shallow render.
 */
export function shallowSnapshot(component: ReactElement) {
  const res = shallowRender(component);
  expect(res).toMatchSnapshot();
  return res;
}

/**
 * Makes snapshot test of the given ReactJS component, and also returns JSON
 * representation of the rendered component tree. Under the hood, it uses
 * {@link module:JU.render render(..)} to render it, then executes
 * `expect(RENDER_RESULT).toMatchSnapshot()`, and then returns `RENDER_RESULT`.
 * @param {object} component ReactJS component to render.
 * @return {object} JSON render of the component.
 */
export function snapshot(component: ReactElement) {
  const res = render(component);
  expect(res).toMatchSnapshot();
  return res;
}

export const simulate = TU.Simulate;

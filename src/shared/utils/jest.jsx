/**
 * Utilities for Jest tests.
 */

/* NOTE: At the moment here is no intention to use this module for runtime
 * execution, only for tests; thus we depend on Jest environment and dev
 * dependencies. */

/* TODO: Revise.  */

/* global expect, jest, document */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import mockdate from 'mockdate';
import PT from 'prop-types';
import { render as newRender, unmountComponentAtNode } from 'react-dom';
import TU from 'react-dom/test-utils';

/* eslint-disable import/no-extraneous-dependencies */
import Renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
/* eslint-enable import/no-extraneous-dependencies */

/* NEW TESTING METHODS */

export { act } from 'react-dom/test-utils';

const originalProcessVersions = process.versions;

export function mockClientSide() {
  Object.defineProperty(process, 'versions', { value: null });
}

export function unmockClientSide() {
  Object.defineProperty(process, 'versions', {
    value: originalProcessVersions,
    writable: false,
  });
}

/**
 * Generates a mock UUID.
 * @param {Number} seed
 * @return {String}
 */
export function getMockUuid(seed = 0) {
  const x = seed.toString(16).padStart(32, '0');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

/**
 * Advances mock timers, and mock date by the specified time.
 * @param {Number} time Time step [ms].
 * @returns {Promise} Wait for this to "jump after" any async code which should
 *  be executed because of the mock time movement.
 */
export async function mockTimer(time) {
  mockdate.set(time + Date.now());
  jest.advanceTimersByTime(time);
}

/**
 * Mounts `Scene` to the DOM, and returns the root scene element.
 * @param {React.ReactNode} scene
 * @return {HTMLElement}
 */
export function mount(scene) {
  const res = document.createElement('div');
  document.body.appendChild(res);
  newRender(scene, res);
  return res;
}

/**
 * Unmounts `scene` from the DOM.
 * @param {HTMLElement} scene
 */
export function unmount(scene) {
  unmountComponentAtNode(scene);
  scene.remove();
}

/* OLD STUFF BELOW THIS MARK */

/**
 * Just an alias for TU.findRenderedDOMComponentWithClass(..).
 * @param {Object} dom
 * @param {String} className
 * @return {Object}
 */
export function findInDomByClass(dom, className) {
  return TU.findRenderedDOMComponentWithClass(dom, className);
}

/**
 * Just an alias for TU.scryRenderedDOMComponentsWithClass(..).
 * @param {Object} dom
 * @param {Stirng} className
 * @return {Array}
 */
export function findInDomManyByClass(dom, className) {
  return TU.scryRenderedDOMComponentsWithClass(dom, className);
}

/**
 * Auxiliary wrapper around ReactJS Test Renderer.
 * @param {Object} component ReactJS component to render.
 * @return {Object} JSON representation of the rendered tree.
 */
export function render(component) {
  return Renderer.create(component).toJSON();
}

/* The Wrapper is necessary for the "renderDom(..)" function, because
 * the "renderIntoDocument(..)" function from "react-dom/test-utils" works
 * only with state components, so we have to wrap our ReactJS components into
 * such Wrapper. */
class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    const { children } = this.props;
    return children;
  }
}

Wrapper.propTypes = {
  children: PT.node.isRequired,
};

/**
 * Renders given component into DOM, using "react-dom/test-utils".
 * @param {Object} component ReactJS component to render.
 * @return {Object} Rendered DOM.
 */
export function renderDom(component) {
  return TU.renderIntoDocument((
    <Wrapper>
      {component}
    </Wrapper>
  ));
}

/**
 * Auxiliary wrapper around ReactJS Shallow Test Renderer.
 * @param {Object} component ReactJS component to render.
 * @return {Object} JSON representation of the shallow component's render tree.
 */
export function shallowRender(component) {
  const renderer = new ShallowRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}

/**
 * Renders provided ReactJS component with ReactJS Shallow Test Renderer,
 * creates/tests its snapshot, and returns the render result.
 * @param {Object} component ReactJS component to render.
 * @return {Object} JSON representation of shallow render.
 */
export function shallowSnapshot(component) {
  const res = shallowRender(component);
  expect(res).toMatchSnapshot();
  return res;
}

/**
 * Renders provided ReactJS component with ReactJS Test Renderer,
 * creates/tests the snapshot, and returns the render.
 * @param {Object} component ReactJS component to render.
 * @return {Object} JSON render of the component.
 */
export function snapshot(component) {
  const res = render(component);
  expect(res).toMatchSnapshot();
  return res;
}

export const simulate = TU.Simulate;

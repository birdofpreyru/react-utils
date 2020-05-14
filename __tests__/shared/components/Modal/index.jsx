import React from 'react';

import pretty from 'pretty';

import Modal from 'components/Modal';

import {
  act,
  mount,
  unmount,
  simulate,
} from 'utils/jest';

jest.useFakeTimers();

let scene;
let onCancel;
beforeEach(() => {
  onCancel = jest.fn();
  scene = mount((
    <div data-id="Modal Code Parent">
      <div data-id="Modal Code Sibling" />
      <Modal
        onCancel={onCancel}
        theme={{
          ad: 'ad',
          hoc: 'hoc',
          context: 'context',
          container: 'container',
        }}
      >
        Modal Content
      </Modal>
    </div>
  ));
});

afterEach(() => {
  if (scene) {
    unmount(scene);
    scene = null;
  }
});

test('Snapshot match', () => {
  expect(pretty(document.body.innerHTML)).toMatchSnapshot();
  act(() => {
    jest.runAllTimers();
  });
  expect(pretty(document.body.innerHTML)).toMatchSnapshot();
});

test('onCancel', () => {
  act(() => {
    jest.runAllTimers();
  });
  const overlay = document.querySelector('div[aria-label=Cancel]');
  simulate.click(overlay);
  expect(onCancel).toHaveBeenCalled();
});

test('onWheel', () => {
  act(() => {
    jest.runAllTimers();
  });
  const container = document.getElementsByClassName('container');
  expect(container.length).toBe(1);
  const stopPropagation = jest.fn();
  simulate.wheel(container[0], { stopPropagation });
  expect(stopPropagation).toHaveBeenCalled();
});

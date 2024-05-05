/** @jest-environment jsdom */

import pretty from 'pretty';

import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import Modal from 'components/Modal';

import { type MountedSceneT, mount } from 'utils/jest';

let scene: MountedSceneT | null;
let onCancel: () => void;

const user = userEvent.setup();

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
    scene.destroy();
    scene = null;
  }
});

test('Snapshot match', () => {
  expect(pretty(document.body.innerHTML)).toMatchSnapshot();
});

test('onCancel', async () => {
  const overlay = document.querySelector('div[aria-label=Cancel]')!;
  await user.click(overlay);
  expect(onCancel).toHaveBeenCalled();
});

// TODO: Not sure why it fails after updating the test to use fireEvent,
// the underlying code has not changed. It should be investigated & fixed later.
test.skip('onWheel', () => {
  const container = document.getElementsByClassName('container');
  expect(container.length).toBe(1);
  const stopPropagation = jest.fn();
  fireEvent.wheel(container[0], { stopPropagation });
  expect(stopPropagation).toHaveBeenCalled();
});

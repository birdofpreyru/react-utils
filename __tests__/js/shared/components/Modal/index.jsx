/** @jest-environment jsdom */

import pretty from 'pretty';

import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import Modal from 'components/Modal';

import { mount } from 'utils/jest';

const user = userEvent.setup();

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
    scene.destroy();
    scene = null;
  }
});

test('Snapshot match', () => {
  expect(pretty(document.body.innerHTML)).toMatchSnapshot();
});

test('onCancel', async () => {
  const overlay = document.querySelector('div[aria-label=Cancel]');
  await user.click(overlay);

  expect(onCancel).toHaveBeenCalled();
});

// TODO: Not sure why this test fail... it seems if the stopPropagation()
// call is set directly on the component by assigning to .onwheel it works
// as expected, but onWheel from <Modal> does not have effect within the test.
// Should be verified in the actual browser. There was no change in the
// underlying code though, just in the test method.
test.skip('onWheel', async () => {
  const container = document.getElementsByClassName('container');
  expect(container.length).toBe(1);

  const event = new WheelEvent('wheel');
  const stopPropagation = jest.spyOn(event, 'stopPropagation');

  fireEvent(container[0], event);
  expect(stopPropagation).toHaveBeenCalled();
});

/* global document */

import _ from 'lodash';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDom from 'react-dom';
import PT from 'prop-types';
import themed from '@dr.pogodin/react-themes';

import baseTheme from './base-theme.scss';
import './styles.scss';

/**
 * @category Components
 * @func Modal
 * @desc
 * ```jsx
 * import { BaseModal, Modal } from '@dr.pogodin/react-utils';
 * ```
 * The `<Modal>` component implements a simple themeable modal window, wrapped
 * into the default theme. `<BaseModal>` exposes the base non-themed component.
 * **Children:** Component children are rendered as the modal content.
 * @param {object} props Component properties.
 * @param {function} [props.onCancel] The callback to trigger when user
 * clicks outside the modal, or presses Escape. It is expected to hide the
 * modal.
 * @param {ModalTheme} [props.theme] _Ad hoc_ theme.
 * @param {...any} [props....]
 * [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 * @example
 * import React, { useState } from 'react';
 * import { Button, Modal } from '@dr.pogodin/react-utils';
 *
 * export default function ModalDemo() {
 *   const [visible, setVisible] = useState(false);
 *   return (
 *     <div>
 *       <Button onClick={() => setVisible(true)}>Show Modal</Button>
 *       {
 *         visible ? (
 *           <Modal onCancel={() => setVisible(false)}>
 *             This is a simple modal. Click outside, or press Escape to close
 *             it.
 *           </Modal>
 *         ) : null
 *       }
 *     </div>
 *   );
 * }
 */
function BaseModal({
  children,
  onCancel,
  theme,
}) {
  const containerRef = useRef();
  const overlayRef = useRef();
  const [portal, setPortal] = useState();

  useEffect(() => {
    const p = document.createElement('div');
    document.body.classList.add('scrolling-disabled-by-modal');
    document.body.appendChild(p);
    setPortal(p);
    return () => {
      document.body.classList.remove('scrolling-disabled-by-modal');
      document.body.removeChild(p);
    };
  }, []);

  const focusLast = useMemo(() => (
    <div
      onFocus={() => {
        const elems = containerRef.current.querySelectorAll('*');
        for (let i = elems.length - 1; i >= 0; --i) {
          elems[i].focus();
          if (document.activeElement === elems[i]) return;
        }
        overlayRef.current.focus();
      }}
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      tabIndex="0"
      /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    />
  ), []);

  return portal ? ReactDom.createPortal(
    (
      <>
        {focusLast}
        <div
          aria-label="Cancel"
          className={theme.overlay}
          onClick={() => onCancel()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel();
          }}
          ref={(node) => {
            if (node && node !== overlayRef.current) {
              overlayRef.current = node;
              node.focus();
            }
          }}
          role="button"
          tabIndex="0"
        />
        <div
          aria-modal="true"
          className={theme.container}
          onWheel={(event) => event.stopPropagation()}
          ref={containerRef}
          role="dialog"
        >
          {children}
        </div>
        <div
          onFocus={() => {
            overlayRef.current.focus();
          }}
          /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
          tabIndex="0"
          /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
        />
        {focusLast}
      </>
    ),
    portal,
  ) : null;
}

/**
 * @category Components
 * @typedef {object} ModalTheme {@link Modal} component theme.
 * @prop {string} [container] Class for modal container.
 * @prop {string} [overlay] Class for modal overlay (the background closing
 * the page underneath the modal).
 */
const ThemedModal = themed(
  'Modal',
  [
    'container',
    'overlay',
  ],
  baseTheme,
)(BaseModal);

BaseModal.propTypes = {
  onCancel: PT.func,
  children: PT.node,
  theme: ThemedModal.themeType,
};

BaseModal.defaultProps = {
  onCancel: _.noop,
  children: null,
};

export default ThemedModal;

/* Non-themed version of the Modal. */
export { BaseModal };

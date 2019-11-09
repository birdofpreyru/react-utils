/**
 * This generic component will implement the semi-transparent background
 * and the white window in the center, which wraps the content provided as
 * children.
 *
 * When semi-transparent background is clicked, it should trigger the onCancel()
 * callback passed from the parent.
 */

/* global document */

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import PT from 'prop-types';
import themed from '@dr.pogodin/react-themes';

import baseTheme from './base-theme.scss';
import './styles.scss';

function BaseModal({
  children,
  onCancel,
  theme,
}) {
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

  return portal ? ReactDom.createPortal(
    (
      <>
        <div
          className={theme.container}
          onWheel={(event) => event.stopPropagation()}
        >
          {children}
        </div>
        <button
          aria-label="Cancel"
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel();
          }}
          onClick={() => onCancel()}
          className={theme.overlay}
          ref={(node) => {
            if (node) {
              node.focus();
            }
          }}
          type="button"
        />
      </>
    ),
    portal,
  ) : null;
}

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

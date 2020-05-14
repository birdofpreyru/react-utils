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
import React from 'react';
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
  const overlayRef = React.useRef();
  const [portal, setPortal] = React.useState();

  React.useEffect(() => {
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
          aria-modal="true"
          className={theme.container}
          onWheel={(event) => event.stopPropagation()}
          role="dialog"
        >
          {children}
        </div>
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
          tabIndex="-1"
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

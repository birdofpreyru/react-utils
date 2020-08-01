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
import React, { useMemo } from 'react';
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
  const containerRef = React.useRef();
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

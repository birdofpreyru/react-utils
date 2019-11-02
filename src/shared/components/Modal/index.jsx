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

/* NOTE: Modal component is implemented as class, as it demands advanced
 * interaction with DOM upon mount and unmount. */
class BaseModal extends React.Component {
  constructor(props) {
    super(props);
    this.portal = document.createElement('div');
  }

  componentDidMount() {
    document.body.classList.add('scrolling-disabled-by-modal');
    document.body.appendChild(this.portal);
  }

  componentWillUnmount() {
    document.body.classList.remove('scrolling-disabled-by-modal');
    document.body.removeChild(this.portal);
  }

  render() {
    const {
      children,
      onCancel,
      theme,
    } = this.props;
    return ReactDom.createPortal(
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
            onClick={() => onCancel()}
            className={theme.overlay}
            type="button"
          />
        </>
      ),
      this.portal,
    );
  }
}

BaseModal.defaultProps = {
  onCancel: _.noop,
  children: null,
  theme: {},
};

BaseModal.propTypes = {
  onCancel: PT.func,
  children: PT.node,
  theme: PT.shape(),
};

/* Non-themed version of the Modal. */
export { BaseModal };

export default themed('Modal', baseTheme)(BaseModal);

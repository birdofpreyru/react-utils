/**
 * The GenericLink wraps around React Router's Link or NavLink component, to
 * automatically replace them by regular <a> elements when:
 * - The target reference points to another domain;
 * - User opts to open the reference in a new tab;
 * - User explicitely opts to use <a>.
 */

/* global window */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function GenericLink({
  children,
  className,
  disabled,
  enforceA,
  keepScrollPosition,
  onClick,
  onMouseDown,
  openNewTab,
  replace,
  routerLinkType,
  to,
  ...rest
}) {
  /* Renders Link as <a> element if:
   * - It is opted explicitely by `enforceA` prop;
   * - It should be opened in a new tab;
   * - It is an absolte URL (starts with http:// or https://);
   * - It is anchor link (starts with #). */
  if (disabled || enforceA || openNewTab || to.match(/^(#|(https?|mailto):)/)) {
    return (
      <a
        className={className}
        disabled={disabled}
        href={to}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        onMouseDown={disabled ? (e) => e.preventDefault() : onMouseDown}
        rel="noopener noreferrer"
        styleName="link"
        target={openNewTab ? '_blank' : ''}
      >
        {children}
      </a>
    );
  }

  /* Otherwise we render the link as React Router's Link or NavLink element. */
  return React.createElement(routerLinkType, {
    className,
    disabled,
    onMouseDown,
    replace,
    to,
    onClick: (e) => {
      /* The link to the current page will scroll to the top of the page. */
      if (!keepScrollPosition) window.scroll(0, 0);

      /* If a custom onClick(..) handler was provided we execute it. */
      return onClick && onClick(e);
    },
    ...rest,
  }, children);
}

GenericLink.defaultProps = {
  children: null,
  className: null,
  disabled: false,
  enforceA: false,
  keepScrollPosition: false,
  onClick: null,
  onMouseDown: null,
  openNewTab: false,
  replace: false,
  to: '',
};

GenericLink.propTypes = {
  children: PT.node,
  className: PT.string,
  disabled: PT.bool,
  enforceA: PT.bool,
  keepScrollPosition: PT.bool,
  onClick: PT.func,
  onMouseDown: PT.func,
  openNewTab: PT.bool,
  replace: PT.bool,
  routerLinkType: PT.elementType.isRequired,
  to: PT.oneOfType([PT.object, PT.string]),
};

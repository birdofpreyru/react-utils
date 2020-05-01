/**
 * The <Button> component implements a standard button / button-like link.
 */

import PT from 'prop-types';
import React from 'react';

import Link from 'components/Link';

import { themed } from 'utils';

import defaultTheme from './style.scss';

function BaseButton({
  active,
  children,
  disabled,
  enforceA,
  onClick,
  onMouseDown,
  openNewTab,
  replace,
  theme,
  to,
}) {
  let className = theme.button;
  if (active && theme.active) className += ` ${theme.active}`;
  if (disabled) {
    if (theme.disabled) className += ` ${theme.disabled}`;
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
  if (to) {
    if (theme.link) className += ` ${theme.link}`;
    return (
      /* NOTE: This ESLint rule enforces us to use <a> and <button> properly
       * in the situations where they are supposed to be used; it is correct
       * from the document structure point of view, but it is not convenient
       * from the developer point of view! The reason is that during active
       * development / prototyping it is often necessary to replace a button
       * by a link, and vice-versa, thus having a component that hides the
       * visual and logic differences between button and links saves tons of
       * developer time. Thus, we sacrifice this rule here in exchange for
       * convenience and efficiency of development. */
      <Link // eslint-disable-line jsx-a11y/anchor-is-valid
        className={className}
        enforceA={enforceA}
        onClick={onClick}
        onMouseDown={onMouseDown}
        openNewTab={openNewTab}
        replace={replace}
        to={to}
      >
        {children}
      </Link>
    );
  }
  return (
    <div
      className={className}
      onClick={onClick}
      onKeyPress={onClick}
      onMouseDown={onMouseDown}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

const ThemedButton = themed('Button', [
  'active',
  'button',
  'disabled',
  'link',
], defaultTheme)(BaseButton);

BaseButton.defaultProps = {
  active: false,
  children: undefined,
  disabled: false,
  enforceA: false,
  onClick: undefined,
  onMouseDown: undefined,
  openNewTab: false,
  replace: false,
  to: undefined,
};

BaseButton.propTypes = {
  active: PT.bool,
  children: PT.node,
  disabled: PT.bool,
  enforceA: PT.bool,
  onClick: PT.func,
  onMouseDown: PT.func,
  openNewTab: PT.bool,
  replace: PT.bool,
  theme: ThemedButton.themeType.isRequired,
  to: PT.oneOfType([PT.object, PT.string]),
};

export default ThemedButton;

/* TODO: Deprecated 2020.05.02. Remove after some time. */
export { BaseButton };

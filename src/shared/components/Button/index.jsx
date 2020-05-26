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
    return (
      <Link
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
function DeprecatedBaseButton(...args) {
  console.warn('[react-utils]: <BaseButton /> export is deprecated');
  /* eslint-disable react/jsx-props-no-spreading */
  return <BaseButton {...args} />;
  /* eslint-disable react/jsx-props-no-spreading */
}
export { DeprecatedBaseButton as BaseButton };

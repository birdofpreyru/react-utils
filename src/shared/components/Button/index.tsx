// The <Button> component implements a standard button / button-like link.

import { type ReactNode } from 'react';

import Link from 'components/Link';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './style.scss';

type PropsT = {
  active?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  enforceA?: boolean;
  onClick?: React.MouseEventHandler & React.KeyboardEventHandler;
  onMouseDown?: React.MouseEventHandler;
  openNewTab?: boolean;
  replace?: boolean;
  theme: Theme<'active' | 'button' | 'disabled'>;
  // TODO: It needs a more precise typing of the object option.
  to?: object | string;
};

/* eslint-disable react/function-component-definition */
export const BaseButton: React.FunctionComponent<PropsT> = ({
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
}) => {
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
      onKeyDown={onClick && ((e) => {
        if (e.key === 'Enter') onClick(e);
      })}
      onMouseDown={onMouseDown}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

/**
 * Button component theme: a map of CSS
 * class names to append to button elements:
 * @prop {string} [active] to the root element of active button.
 * @prop {string} [button] to the root element of any button.
 * @prop {string} [disabled] to the root element of disabled button.
 */
export default themed(BaseButton, 'Button', defaultTheme);

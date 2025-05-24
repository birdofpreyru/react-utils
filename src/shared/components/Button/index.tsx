// The <Button> component implements a standard button / button-like link.

import type {
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
} from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import Link from 'components/Link';

import defaultTheme from './style.scss';

type PropsT = {
  active?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  enforceA?: boolean;
  onClick?: MouseEventHandler & KeyboardEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onPointerDown?: PointerEventHandler;
  openNewTab?: boolean;
  replace?: boolean;
  testId?: string;
  theme: Theme<'active' | 'button' | 'disabled'>;
  // TODO: It needs a more precise typing of the object option.
  to?: object | string;
};

export const BaseButton: FunctionComponent<PropsT> = ({
  active,
  children,
  disabled,
  enforceA,
  onClick,
  onMouseDown,
  onMouseUp,
  onPointerDown,
  openNewTab,
  replace,
  testId,
  theme,
  to,
}) => {
  let className = theme.button;
  if (active && theme.active) className += ` ${theme.active}`;
  if (disabled) {
    if (theme.disabled) className += ` ${theme.disabled}`;
    return (
      <div
        className={className}
        data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
      >
        {children}
      </div>
    );
  }
  if (to) {
    return (
      <Link
        className={className}
        data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
        enforceA={enforceA}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onPointerDown={onPointerDown}
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
      data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter') onClick(e);
      } : undefined}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onPointerDown={onPointerDown}
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

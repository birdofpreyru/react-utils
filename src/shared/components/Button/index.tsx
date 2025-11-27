// The <Button> component implements a standard button / button-like link.

import type {
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
} from 'react';

import { type Theme, useTheme } from '@dr.pogodin/react-themes';

import Link from 'components/Link';

import defaultTheme from './style.scss';

type ThemeT = Theme<'active' | 'button' | 'disabled'>;

type PropsT = {
  active?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  enforceA?: boolean;
  keepScrollPosition?: boolean;
  onClick?: MouseEventHandler & KeyboardEventHandler;
  onKeyDown?: KeyboardEventHandler;
  onKeyUp?: KeyboardEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onPointerDown?: PointerEventHandler;
  onPointerUp?: PointerEventHandler;
  openNewTab?: boolean;
  replace?: boolean;
  testId?: string;
  theme: ThemeT;

  // TODO: It needs a more precise typing of the object option.
  to?: object | string;
};

export const BaseButton: FunctionComponent<PropsT> = ({
  active,
  children,
  disabled,
  enforceA,
  keepScrollPosition,
  onClick,
  onKeyDown: onKeyDownProp,
  onKeyUp,
  onMouseDown,
  onMouseUp,
  onPointerDown,
  onPointerUp,
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

  let onKeyDown = onKeyDownProp;
  if (!onKeyDown && onClick) {
    onKeyDown = (e) => {
      if (e.key === 'Enter') onClick(e);
    };
  }

  if (to) {
    return (
      <Link
        className={className}
        data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
        enforceA={enforceA}

        // TODO: This was exposed as a hotifx... however, I guess we better want
        // to check if the `to` URL contains an anchor (#), and if it does we should
        // automatically opt to keep the position here; and enforce <a> (as
        // react-router link does not seem to respect the hash tag either,
        // at least not without some additional settings).
        keepScrollPosition={keepScrollPosition}

        onClick={onClick}

        // TODO: For now, the `onKeyDown` handler is not passed to the <Link>,
        // as <Link> component does not call it anyway, presumably due to
        // the inner implementation details. We should look into supporting it:
        // https://github.com/birdofpreyru/react-utils/issues/444
        // onKeyDown={onKeyDown}

        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
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
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

const Button: FunctionComponent<
  Omit<PropsT, 'theme'> & { theme?: ThemeT }
> = ({ theme, ...rest }) => {
  const composed = useTheme('Button', defaultTheme, theme);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BaseButton {...rest} theme={composed} />;
};

export default Button;

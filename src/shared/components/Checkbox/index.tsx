import type { ReactNode } from 'react';

import { type Theme, useTheme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type PropT<ValueT> = {
  checked?: ValueT;
  disabled?: boolean;
  error?: ReactNode;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  testId?: string;
  theme?: Theme<
    | 'checkbox'
    | 'container'
    | 'disabled'
    | 'error'
    | 'errorMessage'
    | 'indeterminate'
    | 'label'
  >;
};

const Checkbox = <ValueT extends 'indeterminate' | boolean = boolean>({
  checked,
  disabled,
  error,
  label,
  onChange,
  testId,
  theme,
}: PropT<ValueT>): ReactNode => {
  const composed = useTheme('Checkbox', defaultTheme, theme);

  let containerClassName = composed.container;
  if (disabled) containerClassName += ` ${composed.disabled}`;

  let checkboxClassName = composed.checkbox;
  if (checked === 'indeterminate') checkboxClassName += ` ${composed.indeterminate}`;

  if (error) containerClassName += ` ${composed.error}`;

  return (
    <div className={containerClassName}>
      { label === undefined
        ? null : <div className={composed.label}>{label}</div> }
      <input
        checked={checked === undefined ? undefined : checked === true}
        className={checkboxClassName}
        data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
        disabled={disabled}
        onChange={onChange}
        onClick={(e) => {
          e.stopPropagation();
        }}
        type="checkbox"
      />
      {error && error !== true
        ? <div className={composed.errorMessage}>{error}</div>
        : null}
    </div>
  );
};

export default Checkbox;

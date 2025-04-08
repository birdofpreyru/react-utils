import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type PropT<ValueT> = {
  checked?: ValueT;
  disabled?: boolean;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  testId?: string;
  theme: Theme<
    | 'checkbox'
    | 'container'
    | 'disabled'
    | 'indeterminate'
    | 'label'
  >;
};

const Checkbox = <ValueT extends boolean | 'indeterminate' = boolean>({
  checked,
  disabled,
  label,
  onChange,
  testId,
  theme,
}: PropT<ValueT>) => {
  let containerClassName = theme.container;
  if (disabled) containerClassName += ` ${theme.disabled}`;

  let checkboxClassName = theme.checkbox;
  if (checked === 'indeterminate') checkboxClassName += ` ${theme.indeterminate}`;

  return (
    <div className={containerClassName}>
      { label === undefined
        ? null : <div className={theme.label}>{label}</div> }
      <input
        checked={checked === undefined ? undefined : checked === true}
        className={checkboxClassName}
        data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
        disabled={disabled}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        type="checkbox"
      />
    </div>
  );
};

export default themed(Checkbox, 'Checkbox', defaultTheme);

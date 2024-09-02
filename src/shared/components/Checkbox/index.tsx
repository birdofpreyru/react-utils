import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type PropT<ValueT> = {
  checked?: ValueT;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  theme: Theme<'checkbox' | 'container' | 'indeterminate' | 'label'>;
};

const Checkbox = <ValueT extends boolean | 'indeterminate' = boolean>({
  checked,
  label,
  onChange,
  theme,
}: PropT<ValueT>) => {
  let checkboxClassName = theme.checkbox;
  if (checked === 'indeterminate') checkboxClassName += ` ${theme.indeterminate}`;

  return (
    <div className={theme.container}>
      { label === undefined ? null : <div className={theme.label}>{label}</div> }
      <input
        checked={checked === true}
        className={checkboxClassName}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        type="checkbox"
      />
    </div>
  );
};

export default themed(Checkbox, 'Checkbox', defaultTheme);

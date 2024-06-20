import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type PropT = {
  checked?: boolean;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  theme: Theme<'checkbox' | 'container' | 'label'>;
};

const Checkbox: React.FunctionComponent<PropT> = ({
  checked,
  label,
  onChange,
  theme,
}) => (
  <div className={theme.container}>
    { label === undefined ? null : <div className={theme.label}>{label}</div> }
    <input
      checked={checked}
      className={theme.checkbox}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      type="checkbox"
    />
  </div>
);

export default themed(Checkbox, 'Checkbox', defaultTheme);

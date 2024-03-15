import PT from 'prop-types';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

const validThemeKeys = ['checkbox', 'container', 'label'] as const;

type PropT = {
  checked?: boolean;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  theme: Theme<typeof validThemeKeys>;
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
      type="checkbox"
    />
  </div>
);

/**
 * Checkbox component theme: a map of
 * CSS classes to append to its elements:
 * @prop [checkbox] to the underlying checkbox `<input>` element.
 * @prop [container] to the root checkbox element.
 * @prop [label] to the checkbox label element.
 */
const ThemedCheckbox = themed(
  Checkbox,
  'Checkbox',
  validThemeKeys,
  defaultTheme,
);

/**
 * The `<Checkbox>` component implements themeable checkboxes.
 * @param [props] Component properties.
 * @param [props.checked] Checkbox value.
 * @param [props.label] Checkbox label.
 * @param [props.onChange] State change handler.
 * @param [props.theme] _Ad hoc_ theme.
 * @param [props....]
 * [Other properties of themeable components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).
 */
Checkbox.propTypes = {
  checked: PT.bool,
  label: PT.node,
  onChange: PT.func,
  theme: ThemedCheckbox.themeType.isRequired,
};

Checkbox.defaultProps = {
  checked: undefined,
  label: undefined,
  onChange: undefined,
};

export default ThemedCheckbox;

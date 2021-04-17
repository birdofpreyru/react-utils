import PT from 'prop-types';

import { themed } from 'utils';

import defaultTheme from './theme.scss';

function Checkbox({
  checked,
  label,
  onChange,
  theme,
}) {
  return (
    <div className={theme.container}>
      { label === undefined ? null : <p className={theme.label}>{label}</p> }
      <input
        checked={checked}
        className={theme.checkbox}
        onChange={onChange}
        type="checkbox"
      />
    </div>
  );
}

/**
 * @category Components
 * @typedef {object} CheckboxTheme {@link Checkbox} component theme: a map of
 * CSS classes to append to its elements:
 * @prop {string} checkbox to the underlying checkbox `<input>` element.
 * @prop {string} container to the root checkbox element.
 * @prop {string} label to the checkbox label element.
 */
const ThemedCheckbox = themed('Checkbox', [
  'checkbox',
  'container',
  'label',
], defaultTheme)(Checkbox);

/**
 * @category Components
 * @func Checkbox
 * @desc
 * ```js
 * import { Checkbox } from '@dr.pogodin/react-utils';
 * ```
 * The `<Checkbox>` component implements themeable checkboxes.
 * @param {object} [props] Component properties.
 * @param {boolean} [props.checked] Checkbox value.
 * @param {string} [props.label] Checkbox label.
 * @param {function} [props.onChange] State change handler.
 * @param {CheckboxTheme} [props.theme] _Ad hoc_ theme.
 * @param {...any} [props....]
 * [Other properties of themeable components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).
 */
Checkbox.propTypes = {
  checked: PT.bool,
  label: PT.string,
  onChange: PT.func,
  theme: ThemedCheckbox.themeType.isRequired,
};

Checkbox.defaultProps = {
  checked: undefined,
  label: undefined,
  onChange: undefined,
};

export default ThemedCheckbox;

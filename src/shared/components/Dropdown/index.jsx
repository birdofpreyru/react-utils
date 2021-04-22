import { isString } from 'lodash';
import PT from 'prop-types';

import { themed } from 'utils';

import defaultTheme from './theme.scss';

/**
 * @category Components
 * @typedef {object} DropdownOption Represents a single option inside
 * {@link Dropdown} component.
 * @prop {string} [name] Option name (displayed in UI). If not given,
 * the `value` is used as the name.
 * @prop {string} value Option value key (used inside the code).
 */

/**
 * @category Components
 * @desc
 * ```js
 * import { Dropdown } from '@dr.pogodin/react-utils';
 * ```
 * Implements a themeable dropdown list. Internally it is rendered with help of
 * the standard HTML `<select>` element, thus the styling support is somewhat
 * limited.
 * @param {object} [props] Component properties.
 * @param {function} [props.filter] Options filter function. If provided, only
 * those elements of `options` list will be used by the dropdown, for which this
 * filter returns `true`.
 * @param {string} [props.label] Dropdown label.
 * @param {string} [props.onChange] Selection event handler.
 * @param {DropdownOption[]|string[]} [props.options=[]] Array of dropdown
 * options. For string elements the option value and name will be the same.
 * It is allowed to mix DropdownOption and string elements in the same option
 * list.
 * @param {DropdownTheme} [props.theme] _Ad hoc_ theme.
 * @param {string} [props.value] Currently selected value.
 * @param {...any} [props....]
 * [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 */
function Dropdown({
  filter,
  label,
  onChange,
  options,
  theme,
  value,
}) {
  const optionArray = [(
    <option
      className={theme.hiddenOption}
      key="__reactUtilsHiddenOption"
    >
      &zwnj;
    </option>
  )];
  for (let i = 0; i < options.length; ++i) {
    let op = options[i];
    if (!filter || filter(op)) {
      if (isString(op)) op = { value: op };
      optionArray.push((
        <option className={theme.option} key={op.value} value={op.value}>
          {op.name === undefined ? op.value : op.name }
        </option>
      ));
    }
  }
  return (
    <div className={theme.container}>
      { label === undefined ? null : <p className={theme.label}>{label}</p> }
      <select
        className={theme.select}
        onChange={onChange}
        value={value}
      >
        {optionArray}
      </select>
      <div className={theme.arrow}>▼</div>
    </div>
  );
}

/**
 * @category Components
 * @typedef {object} DropdownTheme {@link Dropdown} component theme.
 * @prop {string} [arrow] Class name for arrow element.
 * @prop {string} [container] Class name for the root dropdown element.
 * @prop {string} [hiddenOption] Class name for the "hidden option" element,
 * which is rendered when dropdown value is undefined.
 * @prop {string} [label] Class name for label element.
 * @prop {string} [option] Class name for each option item element.
 * @prop {string} [select] Class name for the underlying `<select>` element.
 */
const ThemedDropdown = themed('Dropdown', [
  'arrow',
  'container',
  'hiddenOption',
  'label',
  'option',
  'select',
], defaultTheme)(Dropdown);

Dropdown.propTypes = {
  filter: PT.func,
  label: PT.string,
  onChange: PT.func,
  options: PT.arrayOf(
    PT.oneOfType([
      PT.shape({
        name: PT.node,
        value: PT.string.isRequired,
      }),
      PT.string,
    ]).isRequired,
  ),
  theme: ThemedDropdown.themeType.isRequired,
  value: PT.string,
};

Dropdown.defaultProps = {
  filter: undefined,
  label: undefined,
  onChange: undefined,
  options: [],
  value: undefined,
};

export default ThemedDropdown;

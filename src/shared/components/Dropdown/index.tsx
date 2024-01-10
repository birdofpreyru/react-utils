import PT from 'prop-types';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type DropdownOptionT = {
  name?: string | null;
  value: string;
};

type PropsT = {
  filter?: (item: DropdownOptionT | string) => boolean;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options?: Array<DropdownOptionT | string>;
  theme: Theme & {
    arrow?: string;
    container?: string;
    dropdown?: string;
    hiddenOption?: string;
    label?: string;
    option?: string;
    select?: string;
  };
  value?: string;
};

/**
 * Implements a themeable dropdown list. Internally it is rendered with help of
 * the standard HTML `<select>` element, thus the styling support is somewhat
 * limited.
 * @param [props] Component properties.
 * @param [props.filter] Options filter function. If provided, only
 * those elements of `options` list will be used by the dropdown, for which this
 * filter returns `true`.
 * @param [props.label] Dropdown label.
 * @param [props.onChange] Selection event handler.
 * @param [props.options=[]] Array of dropdown
 * options. For string elements the option value and name will be the same.
 * It is allowed to mix DropdownOption and string elements in the same option
 * list.
 * @param [props.theme] _Ad hoc_ theme.
 * @param [props.value] Currently selected value.
 * @param [props....]
 * [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 */
const Dropdown: React.FunctionComponent<PropsT> = ({
  filter,
  label,
  onChange,
  options = [],
  theme,
  value,
}) => {
  let isValidValue = false;
  const optionElements = [];

  for (let i = 0; i < options.length; ++i) {
    const option = options[i];
    if (!filter || filter(option)) {
      let optionValue: string;
      let optionName: string;
      if (typeof option === 'string') {
        optionName = option;
        optionValue = option;
      } else {
        optionName = option.name || option.value;
        optionValue = option.value;
      }
      isValidValue ||= optionValue === value;
      optionElements.push(
        <option className={theme.option} key={optionValue} value={optionValue}>
          {optionName}
        </option>,
      );
    }
  }

  // NOTE: This element represents the current `value` when it does not match
  // any valid option. In Chrome, and some other browsers, we are able to hide
  // it from the opened dropdown; in others, e.g. Safari, the best we can do is
  // to show it as disabled.
  const hiddenOption = isValidValue ? null : (
    <option
      disabled
      className={theme.hiddenOption}
      key="__reactUtilsHiddenOption"
      value={value}
    >
      {value}
    </option>
  );

  return (
    <div className={theme.container}>
      { label === undefined ? null : <p className={theme.label}>{label}</p> }
      <div className={theme.dropdown}>
        <select
          className={theme.select}
          onChange={onChange}
          value={value}
        >
          {hiddenOption}
          {optionElements}
        </select>
        <div className={theme.arrow}>▼</div>
      </div>
    </div>
  );
};

const ThemedDropdown = themed(Dropdown, 'Dropdown', [
  'arrow',
  'container',
  'dropdown',
  'hiddenOption',
  'label',
  'option',
  'select',
], defaultTheme);

Dropdown.propTypes = {
  filter: PT.func,
  label: PT.string,
  onChange: PT.func,
  options: PT.arrayOf(
    PT.oneOfType([
      PT.shape({
        name: PT.string,
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
  value: '',
};

export default ThemedDropdown;

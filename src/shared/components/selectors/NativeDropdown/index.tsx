// Implements dropdown based on the native HTML <select> element.

import type { FunctionComponent } from 'react';

import { useTheme } from '@dr.pogodin/react-themes';

import { optionValueName, type PropsT } from '../common';

import defaultTheme from './theme.scss';

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
const Dropdown: FunctionComponent<PropsT<string>> = ({
  filter,
  label,
  onChange,
  options,
  testId,
  theme,
  value,
}) => {
  let isValidValue = false;
  const optionElements = [];

  const composed = useTheme('Dropdown', defaultTheme, theme);

  for (const option of options) {
    if (!filter || filter(option)) {
      const [iValue, iName] = optionValueName(option);
      isValidValue ||= iValue === value;
      optionElements.push(
        <option className={composed.option} key={iValue} value={iValue}>
          {iName}
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
      className={composed.hiddenOption}
      disabled
      key="__reactUtilsHiddenOption"
      value={value}
    >
      {value}
    </option>
  );

  let selectClassName = composed.select;
  if (!isValidValue) selectClassName += ` ${composed.invalid}`;

  return (
    <div className={composed.container}>
      { label === undefined
        ? null : <div className={composed.label}>{label}</div> }
      <div className={composed.dropdown}>
        <select
          className={selectClassName}
          data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
          onChange={onChange}
          value={value}
        >
          {hiddenOption}
          {optionElements}
        </select>
        <div className={composed.arrow} />
      </div>
    </div>
  );
};

export default Dropdown;

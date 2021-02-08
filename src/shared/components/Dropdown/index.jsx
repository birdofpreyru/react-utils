import { isString } from 'lodash';
import PT from 'prop-types';

import { themed } from 'utils';

import defaultTheme from './theme.scss';

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

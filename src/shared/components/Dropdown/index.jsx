import React from 'react';
import { PT, themed } from 'utils';

import defaultTheme from './theme.scss';

function Dropdown({
  filter,
  label,
  onChange,
  options,
  theme,
  value,
}) {
  const optionArray = [];
  for (let i = 0; i < options.length; ++i) {
    const op = options[i];
    if (!filter || filter(op)) {
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
    </div>
  );
}

const ThemedDropdown = themed('Dropdown', [
  'container',
  'label',
  'option',
  'select',
], defaultTheme)(Dropdown);

Dropdown.propTypes = {
  filter: PT.func,
  label: PT.string,
  onChange: PT.func,
  options: PT.arrayOf(PT.shape({
    name: PT.node,
    value: PT.string.isRequired,
  }).isRequired),
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

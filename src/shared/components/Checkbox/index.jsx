import React from 'react';

import { PT, themed } from 'utils';

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

const ThemedCheckbox = themed('CheckBox', [
  'checkbox',
  'container',
  'label',
], defaultTheme)(Checkbox);

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

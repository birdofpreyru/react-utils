import React from 'react';
import { PT, themed } from 'utils';

import defaultTheme from './theme.scss';

function Input({
  label,
  onChange,
  placeholder,
  theme,
  type,
  value,
}) {
  return (
    <div className={theme.container}>
      { label === undefined ? null : <p className={theme.label}>{label}</p> }
      <input
        className={theme.input}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  );
}

const ThemedInput = themed('Input', [
  'container',
  'input',
  'label',
], defaultTheme)(Input);

Input.propTypes = {
  label: PT.string,
  onChange: PT.func,
  placeholder: PT.string,
  theme: ThemedInput.themeType.isRequired,
  type: PT.string,
  value: PT.string,
};

Input.defaultProps = {
  label: undefined,
  onChange: undefined,
  placeholder: undefined,
  type: undefined,
  value: undefined,
};

export default ThemedInput;

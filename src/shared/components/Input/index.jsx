import { PT, themed } from 'utils';

import defaultTheme from './theme.scss';

function Input({
  label,
  theme,
  ...rest
}) {
  return (
    <div className={theme.container}>
      { label === undefined ? null : <p className={theme.label}>{label}</p> }
      <input
        className={theme.input}
        {...rest} // eslint-disable-line react/jsx-props-no-spreading
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
  theme: ThemedInput.themeType.isRequired,
};

Input.defaultProps = {
  label: undefined,
};

export default ThemedInput;

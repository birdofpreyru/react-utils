import { PT, themed } from 'utils';

import defaultTheme from './theme.scss';

function Dropdown({
  arrow,
  label,
  renderValue,
  theme,
  value,
}) {
  let renderedValue;
  if (renderValue) renderedValue = renderValue(value);
  // TODO: Not quite correct, should be option names.
  else if (Array.isArray(value)) renderedValue = value.join(', ');
  else renderedValue = value;

  return (
    <div className={theme.container}>
      {
        typeof label === 'string' ? (
          <div className={theme.label}>{label}</div>
        ) : null
      }
      <div className={theme.select}>&zwnj;{renderedValue}</div>
      { arrow || <div className={theme.arrow} /> }
    </div>
  );
}

const ThemedDropdown = themed('Dropdown', [
  'arrow',
  'container',
  'label',
  'select',
], defaultTheme)(Dropdown);

Dropdown.propTypes = {
  arrow: PT.node,
  label: PT.node,
  renderValue: PT.func,
  theme: ThemedDropdown.themeType.isRequired,
  value: PT.oneOfType([
    PT.arrayOf(PT.string),
    PT.string,
  ]),
};

Dropdown.defaultProps = {
  arrow: null,
  label: null,
  renderValue: null,
  value: undefined,
};

export default ThemedDropdown;

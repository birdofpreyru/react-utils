/* global window */

import PT from 'prop-types';
import { useCallback, useRef, useState } from 'react';

import { themed } from 'utils';

import Options from './Options';

import defaultTheme from './theme.scss';

function Dropdown({
  arrow,
  filter,
  label,
  onChange,
  options,
  // renderValue,
  theme,
  value,
}) {
  const selectRef = useRef();

  // If "null" no option list is shown, otherwise it holds parameters specifying
  // where the list should be located.
  const [optionListLayout, setOptionListLayout] = useState(null);

  const openOptionList = useCallback(() => {
    const { scrollX, scrollY } = window;
    const rect = selectRef.current.getBoundingClientRect();
    setOptionListLayout({
      left: rect.left + scrollX,
      top: rect.bottom + scrollY,
      width: rect.width,
    });
  }, []);

  const renderedValue = value;
  /*
  if (renderValue) renderedValue = renderValue(value);
  // TODO: Not quite correct, should be option names.
  else if (Array.isArray(value)) renderedValue = value.join(', ');
  else renderedValue = value;
  */

  return (
    <div className={theme.container}>
      {
        typeof label === 'string' ? (
          <div className={theme.label}>{label}</div>
        ) : label
      }
      <div
        className={theme.select}
        onKeyDown={openOptionList}
        onClick={openOptionList}
        ref={selectRef}
        role="listbox"
        tabIndex={0}
      >
        {renderedValue}
        { arrow || <div className={theme.arrow} /> }
      </div>
      {
        optionListLayout ? (
          <Options
            filter={filter}
            layout={optionListLayout}
            onCancel={() => setOptionListLayout(null)}
            onChange={(newValue) => {
              setOptionListLayout(null);
              if (onChange) onChange(newValue);
            }}
            options={options}
            theme={theme}
          />
        ) : null
      }
    </div>
  );
}

const ThemedDropdown = themed('Dropdown', [
  'arrow',
  'container',
  'label',
  'options',
  'optionsOverlay',
  'select',
], defaultTheme)(Dropdown);

Dropdown.propTypes = {
  arrow: PT.node,
  label: PT.node,
  /*
  options: PT.arrayOf(
    PT.oneOfType([
      PT.shape({
        name: PT.node,
        value: PT.string.isRequired,
      }),
      PT.string,
    ]).isRequired,
  ),
  */
  // renderValue: PT.func,
  theme: ThemedDropdown.themeType.isRequired,
  value: PT.oneOfType([
    PT.arrayOf(PT.string),
    PT.string,
  ]),
};

Dropdown.defaultProps = {
  arrow: null,
  label: null,
  // options: [],
  // renderValue: null,
  value: undefined,
};

export default ThemedDropdown;

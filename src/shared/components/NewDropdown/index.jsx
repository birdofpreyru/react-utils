/* global window */

import { noop } from 'lodash';
import PT from 'prop-types';
import { useCallback, useRef, useState } from 'react';

import { themed } from 'utils';

import Options from './Options';

import {
  findNextOptionIndex,
  findPrevOptionIndex,
  optionValue,
} from './utils';

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
  const [active, setActive] = useState(value);

  const multi = Array.isArray(value);

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

  let selectClass = theme.select;
  if (optionListLayout) selectClass += ` ${theme.active}`;

  // Handles key down events on the main dropdown component.
  const keyEventHandler = useCallback((event) => {
    // Sets the option at given index of option array as active,
    // and as the new value. Does nothing if index is negative.
    const setValueByIndex = (index) => {
      if (index >= 0) {
        const newValue = optionValue(options[index]);
        setActive(newValue);
        onChange(newValue);
      }
    };

    console.log('KEY', event.key);

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        setValueByIndex(findPrevOptionIndex(value, options, filter));
        break;
      }
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        setValueByIndex(findNextOptionIndex(value, options, filter));
        break;
      case 'Enter':
        if (optionListLayout) {
          onChange(active);
          setOptionListLayout(null);
        } else openOptionList();
        break;
      case 'Escape':
      case 'Tab':
        setOptionListLayout(null);
        break;
      default:
    }
  }, [
    active,
    filter,
    onChange,
    optionListLayout,
    options,
    openOptionList,
    value,
  ]);

  return (
    <div className={theme.container}>
      {
        typeof label === 'string' ? (
          <div className={theme.label}>{label}</div>
        ) : label
      }
      <div
        className={selectClass}
        onClick={openOptionList}
        onKeyDown={keyEventHandler}
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
            active={active}
            filter={filter}
            layout={optionListLayout}
            onCancel={() => setOptionListLayout(null)}
            onChange={(newValue) => {
              setOptionListLayout(null);
              if (onChange) onChange(newValue);
            }}
            options={options}
            setActive={setActive}
            theme={theme}
            value={value}
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
  onChange: PT.func,
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
  onChange: noop,
  // options: [],
  // renderValue: null,
  value: undefined,
};

export default ThemedDropdown;

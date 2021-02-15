/* global window */

import { noop } from 'lodash';
import PT from 'prop-types';
import { useCallback, useRef, useState } from 'react';

import { themed } from 'utils';

import Options from './Options';

import {
  findNextOptionIndex,
  findPrevOptionIndex,
  isSymbolKey,
  optionValue,
  searchOption,
} from './utils';

import defaultTheme from './theme.scss';

// This is the maximum pause between entered characters pressed on
// the main select element to be considered as a consequent text.
const SEARCH_INPUT_TIMEOUT = 1000;

function Dropdown({
  arrow,
  filter,
  label,
  onChange,
  options,
  theme,
  value,
}) {
  const [active, setActive] = useState(value);
  const { current: heap } = useRef({
    searchTimestamp: 0,
    searchText: '',
    setActive,
  });

  // const multi = Array.isArray(value);

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

  // TODO: Wrong, should render name instead!!!
  const renderedValue = value;

  let selectClass = theme.select;
  if (optionListLayout) selectClass += ` ${theme.active}`;

  // Handles key down events on the main dropdown component.
  const keyEventHandler = useCallback((event) => {
    // Sets the option at given index of option array as active,
    // and as the new value. Does nothing if index is negative.
    const setValueByIndex = (index) => {
      if (index >= 0) {
        heap.setActive = noop;
        const newValue = optionValue(options[index]);
        setActive(newValue);
        onChange(newValue);
        setTimeout(() => {
          heap.setActive = setActive;
        }, 100);
      }
    };

    const now = Date.now();
    let search = false;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        setValueByIndex(findPrevOptionIndex(active, options, filter));
        break;
      }
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        setValueByIndex(findNextOptionIndex(active, options, filter));
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
        if (isSymbolKey(event.key)) {
          if (event.key === heap.searchText
          || now - heap.searchTimestamp > SEARCH_INPUT_TIMEOUT) {
            heap.searchText = event.key;
          } else heap.searchText += event.key;
          setValueByIndex(
            searchOption(heap.searchText, options, active, filter),
          );
          heap.searchTimestamp = now;
          search = true;
        }
    }
    if (!search) {
      heap.searchTimestamp = 0;
      heap.searchText = '';
    }
  }, [
    active,
    filter,
    heap,
    onChange,
    optionListLayout,
    options,
    openOptionList,
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
            setActive={(newActive) => heap.setActive(newActive)}
            theme={theme}
            value={value}
          />
        ) : null
      }
    </div>
  );
}

const ThemedDropdown = themed('Dropdown', [
  'active',
  'arrow',
  'container',
  'label',
  'option',
  'options',
  'optionsOverlay',
  'select',
], defaultTheme)(Dropdown);

Dropdown.propTypes = {
  arrow: PT.node,
  filter: PT.func,
  label: PT.node,
  onChange: PT.func,
  options: PT.arrayOf(PT.any).isRequired,
  theme: ThemedDropdown.themeType.isRequired,
  value: PT.oneOfType([
    PT.arrayOf(PT.string),
    PT.string,
  ]),
};

Dropdown.defaultProps = {
  arrow: null,
  filter: null,
  label: null,
  onChange: noop,
  value: undefined,
};

export default ThemedDropdown;

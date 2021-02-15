/**
 * Renders Dropdown option list into a new portal created at the root of DOM.
 */
/* global document */

import { noop } from 'lodash';
import PT from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Option from '../Option';

import { optionNameValue } from '../utils';

export default function Options({
  active,
  filter,
  layout,
  options,
  onCancel,
  onChange,
  setActive,
  theme,
}) {
  const { current: heap } = useRef({
    setActive,
  });
  const optionsRef = useRef();
  const [portal, setPortal] = useState();

  useEffect(() => {
    const p = document.createElement('div');
    document.body.appendChild(p);
    setPortal(p);
    return () => document.body.removeChild(p);
  }, []);

  const renderedOptions = [];
  options.forEach((option) => {
    if (!filter || filter(option)) {
      const [name, optionValue] = optionNameValue(option);
      renderedOptions.push((
        <Option
          active={optionValue === active}
          key={optionValue}
          name={name === undefined ? optionValue : name}
          onActive={() => heap.setActive(optionValue)}
          onToggle={() => {
            onChange(optionValue);
          }}
          theme={theme}
          value={optionValue}
        />
      ));
    }
  });

  return portal ? createPortal((
    // TODO: This turns out to be quite similar to the code used in <Modal>
    // component, but not exactly the same. Still might be a good exercise,
    // and optimization to abstract out the common part.
    <>
      <div
        aria-label="Cancel"
        className={theme.optionsOverlay}
        onClick={() => onCancel()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel();
        }}
        role="button"
        tabIndex={0}
      />
      <div
        className={theme.options}
        ref={(node) => {
          if (node && !optionsRef.current) {
            heap.setActive = noop;
            node.scrollIntoView();
            setTimeout(() => {
              heap.setActive = setActive;
            });
          }
          optionsRef.current = node;
        }}
        style={{
          left: layout.left,
          minWidth: layout.width,
          top: layout.top,
        }}
      >
        {renderedOptions}
      </div>
    </>
  ), portal) : null;
}

Options.propTypes = {
  active: PT.string,
  options: PT.arrayOf(
    PT.oneOfType([
      PT.object,
      PT.string,
    ]).isRequired,
  ),
  setActive: PT.func.isRequired,
  value: PT.oneOfType([
    PT.arrayOf(PT.string),
    PT.string,
  ]),
};

Options.defaultProps = {
  options: [],
  value: undefined,
};

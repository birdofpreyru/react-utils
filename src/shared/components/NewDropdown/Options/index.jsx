/**
 * Renders Dropdown option list into a new portal created at the root of DOM.
 */
/* global document */

import PT from 'prop-types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Option from '../Option';

export default function Options({
  filter,
  layout,
  options,
  onCancel,
  onChange,
  theme,
}) {
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
      let name;
      let value;
      if (typeof option === 'string') {
        name = option;
        value = option;
      } else ({ name, value } = option);
      renderedOptions.push((
        <Option
          key={value}
          name={name === undefined ? value : name}
          onToggle={() => {
            onChange(value);
          }}
          theme={theme}
          value={value}
        />
      ));
    }
  });

  // TODO: This should also handle Tabs, arrow clicks to navigate around with
  // keyboard.
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
          if (node) node.scrollIntoView();
        }}
        style={{
          left: layout.left,
          top: layout.top,
          width: layout.width,
        }}
      >
        {renderedOptions}
      </div>
    </>
  ), portal) : null;
}

Options.propTypes = {
  options: PT.arrayOf(
    PT.oneOfType([
      PT.object,
      PT.string,
    ]).isRequired,
  ),
};

Options.defaultProps = {
  options: [],
};

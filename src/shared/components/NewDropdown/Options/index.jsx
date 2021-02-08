/**
 * Renders Dropdown option list into a new portal created at the root of DOM.
 */
/* global document */

// import PT from 'prop-types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Options({
  layout,
  onCancel,
  theme,
}) {
  const [portal, setPortal] = useState();

  useEffect(() => {
    const p = document.createElement('div');
    document.body.appendChild(p);
    setPortal(p);
    return () => document.body.removeChild(p);
  }, []);

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
        style={{
          left: layout.left,
          top: layout.top,
          width: layout.width,
        }}
      >
        OPTIONS
      </div>
    </>
  ), portal) : null;
}

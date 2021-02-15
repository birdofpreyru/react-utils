/**
 * Renders a single option in the opened dropdown list.
 */

import PT from 'prop-types';
import { useEffect, useRef } from 'react';

export default function Option({
  active,
  onActive,
  onToggle,
  name,
  theme,
}) {
  let className = theme.option;
  if (active) className += ` ${theme.active}`;

  const { current: heap } = useRef({
    ref: null,
  });

  useEffect(() => {
    if (active && heap.ref) {
      heap.ref.scrollIntoView();
    }
  }, [active, heap]);

  return (
    <div
      className={className}
      onClick={onToggle}
      onKeyPress={onToggle}
      onMouseEnter={onActive}
      ref={(node) => {
        heap.ref = node;
      }}
      role="button"
      tabIndex={0}
    >
      {name}
    </div>
  );
}

Option.propTypes = {
  active: PT.bool.isRequired,
  name: PT.string.isRequired,
  onActive: PT.func.isRequired,
  onToggle: PT.func.isRequired,
  theme: PT.shape().isRequired,
};

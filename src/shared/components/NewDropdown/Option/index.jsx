/**
 * Renders a single option in the opened dropdown list.
 */

import PT from 'prop-types';
import { forwardRef } from 'react';

const Option = forwardRef(({
  active,
  onActive,
  onToggle,
  name,
  theme,
}, ref) => {
  let className = theme.option;
  if (active) className += ` ${theme.active}`;
  return (
    <div
      className={className}
      onClick={onToggle}
      onKeyPress={onToggle}
      onMouseEnter={onActive}
      ref={ref}
      role="button"
      tabIndex={0}
    >
      {name}
    </div>
  );
});

Option.propTypes = {
  active: PT.bool.isRequired,
  name: PT.string.isRequired,
  onActive: PT.func.isRequired,
  onToggle: PT.func.isRequired,
  theme: PT.shape().isRequired,
};

export default Option;

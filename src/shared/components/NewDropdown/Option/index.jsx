/**
 * Renders a single option in the opened dropdown list.
 */

import PT from 'prop-types';

export default function Option({
  active,
  onActive,
  onToggle,
  name,
  theme,
}) {
  let className = theme.option;
  if (active) className += ` ${theme.active}`;
  return (
    <div
      className={className}
      onClick={onToggle}
      onKeyPress={onToggle}
      onMouseEnter={onActive}
      role="button"
      tabIndex={0}
    >
      {name}
    </div>
  );
}

Option.propTypes = {
  name: PT.string,
  theme: PT.shape().isRequired,
};

Option.defaultProps = {
  name: undefined,
};

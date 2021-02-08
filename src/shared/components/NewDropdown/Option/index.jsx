/**
 * Renders a single option in the opened dropdown list.
 */

import PT from 'prop-types';

export default function Option({
  onToggle,
  name,
  theme,
}) {
  return (
    <div
      className={theme.option}
      onClick={onToggle}
      onKeyPress={onToggle}
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

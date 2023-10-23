import PT from 'prop-types';
import { type ReactNode } from 'react';

import './style.scss';

type PropsT = {
  children?: ReactNode;
  className?: string;
  ratio?: `${number}:${number}`,
};

/**
 * The `<ScalableRect>` component implements container keeping given aspect
 * ratio, while its width is altered.
 *
 * **Children:** Component children are rendered as the component's content.
 * @param {object} props
 * @param {string} [props.className] CSS class for component container.
 * @param {string} [props.ratio=1:1] Ratio of the rendered rectangle sides,
 * in `W:H` form.
 */
const ScalableRect: React.FunctionComponent<PropsT> = ({
  children,
  className,
  ratio,
}) => {
  const aux = ratio!.split(':');
  const paddingBottom = `${(100 * parseFloat(aux[1])) / parseFloat(aux[0])}%`;

  /* NOTE: In case the following code looks strange to you, mind that we want to
   * allow the user to set custom styles on this component. If user passes in a
   * "className" prop (possibly "styleName", but that one is converted to
   * "className" by Babel just before being passed into this component), it
   * should not interfere with the sizing behavior, thus we need an extra <div>
   * level in this component; however, if user does not need a custom styling,
   * we can save one level of HTML code, so we do it. */
  const rect = (
    <div
      style={{ paddingBottom }}
      styleName="container"
    >
      <div styleName="wrapper">
        {children}
      </div>
    </div>
  );
  return className ? (
    <div className={className}>
      {rect}
    </div>
  ) : rect;
};

ScalableRect.defaultProps = {
  children: null,
  className: undefined,
  ratio: '1:1',
};

ScalableRect.propTypes = {
  children: PT.node,
  className: PT.string,
  ratio: (props, name) => {
    const ratio = props[name];

    // "ratio" prop is not required (defaults "1:1").
    if (ratio === undefined) return null;

    // If given, "ratio" must be a string.
    if (typeof ratio !== 'string') {
      return Error('"ratio" prop must be a string');
    }

    // If given, "ratio" must have "H:W" format.
    if (!ratio.match(/\d\.\d+/)) {
      return Error('"ratio" prop must have "H:W" format');
    }

    // Everything looks right.
    return null;
  },
};

export default ScalableRect;

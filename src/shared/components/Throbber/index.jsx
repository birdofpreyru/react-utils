import PT from 'prop-types';
import themed from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

/**
 * @category Components
 * @func Throbber
 * @desc
 * ```jsx
 * import { Throbber } from '@dr.pogodin/react-utils';
 * ```
 * Throbber is an "action in progress" indicator, which renders
 * three bouncing circles as a simple pending activity indicator,
 * and can be further themed to a certain degree.
 * @param {object} [props] Component properties.
 * @param {ThrobberTheme} [props.theme] _Ad hoc_ theme.
 * @param {...any} [props....]
 * [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 */
function Throbber({
  theme,
}) {
  return (
    <div className={theme.container} styleName="container">
      <div className={theme.circle} styleName="circle" />
      <div className={theme.circle} styleName="circle" />
      <div className={theme.circle} styleName="circle" />
    </div>
  );
}

Throbber.defaultProps = {
  theme: {},
};

Throbber.propTypes = {
  theme: PT.shape({
    container: PT.string,
    circle: PT.string,
  }),
};

/**
 * @category Components
 * @typedef {object} ThrobberTheme {@link Throbber} theme.
 * @prop {string} [container] Class name to add to the throbber container.
 * @prop {string} [circle] Class name to add to each throbber circle.
 */
export default themed('Throbber', [
  'circle',
  'container',
], defaultTheme)(Throbber);

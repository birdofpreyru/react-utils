import PT from 'prop-types';
import themed from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

/**
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

export default themed('Throbber', [
  'circle',
  'container',
], defaultTheme)(Throbber);

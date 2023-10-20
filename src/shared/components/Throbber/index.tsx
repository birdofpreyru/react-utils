import PT from 'prop-types';
import { type FunctionComponent } from 'react';

import { themedComponent, type ThemeT } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type PropsT = {
  theme: ThemeT & {
    container?: string;
    circle?: string;
  };
};

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
}: PropsT) {
  return (
    <span className={theme.container} styleName="container">
      <span className={theme.circle} styleName="circle" />
      <span className={theme.circle} styleName="circle" />
      <span className={theme.circle} styleName="circle" />
    </span>
  );
}

Throbber.propTypes = {
  theme: PT.shape({
    container: PT.string,
    circle: PT.string,
  }).isRequired,
};

export default themedComponent(
  'Throbber',
  Throbber as FunctionComponent<PropsT>,
  [
    'circle',
    'container',
  ],
  defaultTheme,
);

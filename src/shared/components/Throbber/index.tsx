import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type PropsT = {
  theme: Theme & {
    bouncing?: string;
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
const Throbber: React.FunctionComponent<PropsT> = ({ theme }) => (
  <span className={theme.container}>
    <span className={theme.circle} />
    <span className={theme.circle} />
    <span className={theme.circle} />
  </span>
);

const ThemedThrobber = themed(
  Throbber,
  'Throbber',
  [
    'bouncing',
    'circle',
    'container',
  ],
  defaultTheme,
);

Throbber.propTypes = {
  theme: ThemedThrobber.themeType.isRequired,
};

export default ThemedThrobber;
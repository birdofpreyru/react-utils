import type { FunctionComponent } from 'react';

import { type PRIORITY, type Theme, useTheme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type ThemeKeyT = 'bouncing' | 'circle' | 'container';

type PropsT = {
  theme?: Theme<ThemeKeyT>;
  themePriority?: PRIORITY;
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
const Throbber: FunctionComponent<PropsT> = ({ theme, themePriority }) => {
  const custom = useTheme('Throbber', defaultTheme, theme, {
    themePriority,
  });

  return (
    <span className={custom.container}>
      <span className={custom.circle} />
      <span className={custom.circle} />
      <span className={custom.circle} />
    </span>
  );
};

export default Throbber;

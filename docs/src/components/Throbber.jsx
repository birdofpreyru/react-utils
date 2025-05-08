import { useColorMode } from '@docusaurus/theme-common';
import { Throbber } from '@dr.pogodin/react-utils';

import lightThrobberTheme from '../themes/throbber/light.module.scss';

function WrappedThrobber() {
  const { isDarkTheme } = useColorMode();
  return <Throbber theme={isDarkTheme ? lightThrobberTheme : undefined} />;
}

export default WrappedThrobber;

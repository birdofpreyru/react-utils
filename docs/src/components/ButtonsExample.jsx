/* global alert */

import { useColorMode } from '@docusaurus/theme-common';
import { Button, ThemeProvider } from '@dr.pogodin/react-utils';

import darkButtonTheme from '../themes/buttons/dark.module.scss';

function ButtonsExample() {
  const { isDarkTheme } = useColorMode();
  return (
    <ThemeProvider
      themes={{ Button: isDarkTheme ? darkButtonTheme : undefined }}
    >
      <Button
        onClick={() => {
          // eslint-disable-next-line no-alert
          alert('Button Clicked');
        }}
      >
        Button
      </Button>
      <Button openNewTab to="https://dr.pogodin.studio">
        Button-Like Link
      </Button>
      <Button disabled>Disabled Button</Button>
      <Button active>Forced-Active Button</Button>
    </ThemeProvider>
  );
}

export default ButtonsExample;

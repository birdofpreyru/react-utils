/* global alert */
/* eslint-disable no-alert */

import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { Button, ThemeProvider } from '@dr.pogodin/react-utils';

import darkButtonTheme from '../themes/buttons/dark.module.scss';

export default function ButtonsExample() {
  const { isDarkTheme } = useColorMode();
  return (
    <ThemeProvider
      themes={{ Button: isDarkTheme ? darkButtonTheme : undefined }}
    >
      <Button onClick={() => alert('Button Clicked')}>Button</Button>
      <Button to="https://dr.pogodin.studio" openNewTab>
        Button-Like Link
      </Button>
      <Button disabled>Disabled Button</Button>
      <Button active>Forced-Active Button</Button>
    </ThemeProvider>
  );
}

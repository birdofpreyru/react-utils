import { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { Button, Modal, ThemeProvider } from '@dr.pogodin/react-utils';

import darkButtonTheme from '../themes/buttons/dark.module.scss';
import darkModalTheme from '../themes/modals/dark.module.scss';

function ModalExample() {
  const [open, setOpen] = useState(false);
  const isDarkTheme = useColorMode().colorMode === 'dark';
  return (
    <ThemeProvider
      themes={
        isDarkTheme ? {
          Button: darkButtonTheme,
          Modal: darkModalTheme,
        } : undefined
      }
    >
      {
        open ? (
          <Modal onCancel={() => setOpen(false)}>
            <h1>Example Modal</h1>
            <Button onClick={() => setOpen(false)}>
              Click to close the Modal
            </Button>
          </Modal>
        ) : null
      }
      <Button onClick={() => setOpen(true)}>Click to open the Modal</Button>
    </ThemeProvider>
  );
}

export default ModalExample;

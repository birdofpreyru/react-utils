/* global alert */
/* eslint-disable no-alert */

import React from 'react';
import { Button } from '@dr.pogodin/react-utils';

export default function ButtonsExample() {
  return (
    <div>
      <Button onClick={() => alert('Button Clicked')}>Button</Button>
      <Button to="https://dr.pogodin.studio" openNewTab>
        Button-Like Link
      </Button>
      <Button disabled>Disabled Button</Button>
      <Button active>Forced-Active Button</Button>
    </div>
  );
}

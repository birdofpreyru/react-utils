import React from 'react';
import { WithTooltip } from '@dr.pogodin/react-utils';

export default function WithTooltipExample() {
  return (
    <WithTooltip tip="This is an example tooltip">
      <p>Hover to see the tooltip.</p>
    </WithTooltip>
  );
}

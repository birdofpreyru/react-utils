import { useState } from 'react';

import { Checkbox } from '@dr.pogodin/react-utils';

export default function CheckboxExample() {
  const [checkbox2, setCheckbox2] = useState<boolean>(true);
  const [checkbox3a, setCheckbox3a] = useState<boolean | 'indeterminate'>('indeterminate');
  const [checkbox3b, setCheckbox3b] = useState<boolean | 'indeterminate'>('indeterminate');
  return (
    <>
      <Checkbox
        checked={checkbox2}
        label="Managed two-states checkbox"
        onChange={(e) => setCheckbox2(e.target.checked)}
      />
      <Checkbox
        checked={checkbox3a}
        label="Managed three-states checkbox"
        onChange={() => {
          switch (checkbox3a) {
            case true: return setCheckbox3a(false);
            case 'indeterminate': return setCheckbox3a(true);
            default: return setCheckbox3a('indeterminate');
          }
        }}
      />
      <Checkbox
        checked={checkbox3b}
        disabled
        label="Managed three-states checkbox"
        onChange={() => {
          switch (checkbox3b) {
            case true: return setCheckbox3b(false);
            case 'indeterminate': return setCheckbox3b(true);
            default: return setCheckbox3b('indeterminate');
          }
        }}
      />
    </>
  );
}

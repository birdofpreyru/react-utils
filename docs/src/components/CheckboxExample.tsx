import { type FunctionComponent, useState } from 'react';

import { Checkbox } from '@dr.pogodin/react-utils';

const CheckboxExample: FunctionComponent = () => {
  const [checkbox2, setCheckbox2] = useState<boolean>(true);
  const [checkbox3a, setCheckbox3a] = useState<boolean | 'indeterminate'>('indeterminate');
  const [checkbox3b, setCheckbox3b] = useState<boolean | 'indeterminate'>('indeterminate');
  return (
    <>
      <Checkbox
        checked={checkbox2}
        label="Managed two-states checkbox"
        onChange={(e) => {
          setCheckbox2(e.target.checked);
        }}
      />
      <Checkbox
        checked={checkbox3a}
        label="Managed three-states checkbox"
        onChange={() => {
          switch (checkbox3a) {
            case true:
              setCheckbox3a(false);
              break;
            case 'indeterminate':
              setCheckbox3a(true);
              break;
            case false:
            default:
              setCheckbox3a('indeterminate');
          }
        }}
      />
      <Checkbox
        checked={checkbox3b}
        disabled
        label="Managed three-states checkbox"
        onChange={() => {
          switch (checkbox3b) {
            case true:
              setCheckbox3b(false);
              break;
            case 'indeterminate':
              setCheckbox3b(true);
              break;
            case false:
            default:
              setCheckbox3b('indeterminate');
          }
        }}
      />
    </>
  );
};

export default CheckboxExample;

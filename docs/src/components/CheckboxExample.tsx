import { type FunctionComponent, useState } from 'react';

import { Checkbox } from '@dr.pogodin/react-utils';

const CheckboxExample: FunctionComponent = () => {
  const [checkbox2, setCheckbox2] = useState<boolean>(true);
  const [checkbox3a, setCheckbox3a] = useState<'indeterminate' | boolean>('indeterminate');
  const [checkbox3b, setCheckbox3b] = useState<'indeterminate' | boolean>('indeterminate');
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
            case 'indeterminate':
              setCheckbox3a(true);
              break;
            case true:
              setCheckbox3a(false);
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
        label="Disabled checkbox"
        onChange={() => {
          switch (checkbox3b) {
            case 'indeterminate':
              setCheckbox3b(true);
              break;
            case true:
              setCheckbox3b(false);
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

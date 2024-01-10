import { useState } from 'react';
import { Dropdown } from '@dr.pogodin/react-utils';

const SAMPLE_OPTIONS = [{
  name: 'Option #1',
  value: 'option1',
}, {
  name: 'Option #2',
  value: 'option2',
}, {
  value: 'option3',
},
'option #4',
];

export default function DropdownExample() {
  const [value, setValue] = useState();
  return (
    <div>
      <Dropdown
        label="Label"
        onChange={(e) => setValue(e.target.value)}
        options={SAMPLE_OPTIONS}
        value={value}
      />
    </div>
  );
}

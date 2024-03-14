import { useState } from 'react';
import { CustomDropdown, Dropdown } from '@dr.pogodin/react-utils';

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

const SAMPLE_OPTIONS_2 = [{
  name: (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <div
        style={{
          background: 'red',
          borderRadius: 10,
          height: 10,
          marginRight: 5,
          width: 10,
        }}
      />
      Option #1
    </div>
  ),
  value: 'option1',
}, {
  name: (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <div
        style={{
          background: 'green',
          borderRadius: 10,
          height: 10,
          marginRight: 5,
          width: 10,
        }}
      />
      Option #2
    </div>
  ),
  value: 'option2',
}, {
  name: (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <div
        style={{
          background: 'blue',
          borderRadius: 10,
          height: 10,
          marginRight: 5,
          width: 10,
        }}
      />
      Option #3
    </div>
  ),
  value: 'option3',
}];

export default function DropdownExample() {
  const [value, setValue] = useState();
  const [value2, setValue2] = useState();
  return (
    <div>
      <Dropdown
        label="Native <Dropdown>"
        onChange={(e) => setValue(e.target.value)}
        options={SAMPLE_OPTIONS}
        value={value}
      />
      <br />
      <CustomDropdown
        label="<CustomDropdown>"
        onChange={setValue2}
        options={SAMPLE_OPTIONS_2}
        value={value2}
      />
    </div>
  );
}

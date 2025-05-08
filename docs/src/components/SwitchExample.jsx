import { useState } from 'react';
import { Switch } from '@dr.pogodin/react-utils';

const OPTIONS = [{
  name: 'Option #1',
  value: 'option1',
}, {
  name: 'Option #2',
  value: 'option2',
}, {
  name: 'Option #3',
  value: 'option3',
}];

function Example() {
  const [value, setValue] = useState('option1');
  return (
    <Switch
      label="<Switch> demo"
      onChange={setValue}
      options={OPTIONS}
      value={value}
    />
  );
}

export default Example;

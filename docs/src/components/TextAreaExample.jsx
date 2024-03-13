import { useState } from 'react';
import { TextArea } from '@dr.pogodin/react-utils';

export default function TextAreaExample() {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('Disabled text area');
  return (
    <div>
      <TextArea
        onChange={(e) => setValue(e.target.value)}
        placeholder="Auto-resizeable text area"
        value={value}
      />
      <TextArea
        disabled
        onChange={(e) => setValue2(e.target.value)}
        value={value2}
      />
    </div>
  );
}

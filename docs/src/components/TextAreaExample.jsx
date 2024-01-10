import { useState } from 'react';
import { TextArea } from '@dr.pogodin/react-utils';

export default function TextAreaExample() {
  const [value, setValue] = useState('');
  return (
    <TextArea
      onChange={(e) => setValue(e.target.value)}
      placeholder="Auto-resizeable text area"
      value={value}
    />
  );
}

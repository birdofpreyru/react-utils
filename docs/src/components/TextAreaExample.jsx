import { useState } from 'react';
import { TextArea } from '@dr.pogodin/react-utils';

function TextAreaExample() {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('Disabled text area');
  const [value3, setValue3] = useState('');
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
      <TextArea
        error="Sample error message"
        onChange={(e) => setValue3(e.target.value)}
        placeholder="Text-area with sample error message"
        value={value3}
      />
    </div>
  );
}

export default TextAreaExample;

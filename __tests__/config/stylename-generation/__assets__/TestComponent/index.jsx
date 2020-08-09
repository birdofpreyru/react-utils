import React from 'react';

import style from './style.scss';

export default function TestComponent() {
  return (
    <div styleName="testClassName">
      {JSON.stringify(style)}
    </div>
  );
}

# Modal
```jsx
import { BaseModal, Modal } from '@dr.pogodin/react-utils';
```
The `<Modal>` component implements a simple themeable modal window, wrapped
into the default theme. `<BaseModal>` exposes the base non-themed component.

### Example

```jsx
import React, { useState } from 'react';
import { Button, Modal } from '@dr.pogodin/react-utils';

export default function ModalDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setVisible(true)}>Show Modal</Button>
      {
        visible ? (
          <Modal onCancel={() => setVisible(false)}>
            This is a simple modal. Click outside, or press Escape to close it.
          </Modal>
        ) : null
      }
    </div>
  );
}

```

### Reference

**Children** are rendered as the modal content.

**Properties**

- `[onCancel]` (_Function_) &ndash; Optional. The callback to trigger when user
  clicks outside the modal, or presses Escape. It is expected to hide the modal.
- `[theme]` (_Object_) &ndash; Optional. _Ad hoc_ modal
  [theme](https://github.com/birdofpreyru/react-utils/blob/master/docs/react-themes.md):
  - `[container]` (_String_) &ndash; Optional. Modal container class.
  - `[overlay]` (_String_)  &ndash; Optional. Modal overlay (background closing
    the page underneath the modal) class.
- It also accepts other properties inherited from the themed component wrapper.

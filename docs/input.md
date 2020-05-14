# Input

```jsx
import { Input } from '@dr.pogodin/react-utils';
```

Implements a [themed](docs/react-themes.md) input component.

### Reference

- `<Input>` &ndash; A themed input.

  **Props:**
  - `label?: string` &ndash; Optional. Checkbox label. Defaults `undefined`.
  - `onChange?: function` &ndash; Optional. State change event handler.
  - `placeholder?: string` &ndash; Optional. Input placeholder.
  - `theme?: object` &ndash; Optional. _Ad-hoc_ theme. Valid theme keys:
    - `container`
    - `input`
    - `label`
  - `type?: string` &ndash; Optional. Input type.
  - `value?: string` &ndash; Optional. Input value.

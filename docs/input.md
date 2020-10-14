# Input

```jsx
import { Input } from '@dr.pogodin/react-utils';
```

Implements a [themed](docs/react-themes.md) input component.

### Reference

- `<Input>` &ndash; A themed input.

  **Props:**
  - `label?: string` &ndash; Optional. Checkbox label. Defaults `undefined`.
  - `theme?: object` &ndash; Optional. _Ad-hoc_ theme. Valid theme keys:
    - `container`
    - `input`
    - `label`
  - Any other props are forwarded directly to the underlying standard
    `<input>` element. Most probably you want to set:
    - `onChange: function`
    - `placeholder: string`
    - `type: string`
    - `value: string`

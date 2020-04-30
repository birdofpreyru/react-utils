# Checkbox

```jsx
import { Checkbox } from '@dr.pogodin/react-utils';
```

Implements a [themed](docs/react-themes.md) checkbox component.

### Reference

- `<Checkbox>` &ndash; A themed checkbox.

  **Props:**
  - `checked?: boolean` &ndash; Optional. Checkbox value. Defaults `false`.
  - `label?: string` &ndash; Optional. Checkbox label. Defaults `undefined`.
  - `onChanged?: function` &ndash; Optional. State change event handler.

  - `theme?: object` &ndash; Optional. _Ad-hoc_ theme. Valid theme keys:
    - `checkbox`
    - `container`
    - `label`

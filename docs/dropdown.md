# Dropdown

```jsx
import { Dropdown } from '@dr.pogodin/react-utils';
```

Implements a [themed](docs/react-themes.md) dropdown component.

### Reference

- `<Dropdown>` &ndash; A themed dropdown.

  **Props:**
  - `filter?: function` &ndash; Optional. Filter function for provided `options`
    prop. Defaults: no filter, all options will be used.
  - `label?: string` &ndash; Optional. Checkbox label. Defaults `undefined`.
  - `onChanged?: function` &ndash; Optional. State change event handler.
  - `options?: object[]|string` &ndash; Optional. Array of options to show in
    the dropdown. Defaults `[]`. Each option, if an object, has two fields:
    - `name?: string` &ndash; Optional. Option name to display in UI. Defaults:
      if undefined, the `value` option will be used as the name.
    - `value: string` &ndash; Option value key.

    If an option value is a string, it is understood as both the value key,
    and option name.

  - `theme?: object` &ndash; Optional. _Ad-hoc_ theme. Valid theme keys:
    - `arrow`
    - `container`
    - `label`
    - `option`
    - `select`

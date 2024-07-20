# Dropdown

```jsx
import { CustomDropdown, Dropdown } from '@dr.pogodin/react-utils';
```

The [Dropdown] component implements a dropdown input themed using [React Themes]
library. Under the hood it relies on the native `<select>` element,
thus the styling support is somewhat limited, but on the other hand it is
natively integrated with browsers.

For use cases requiring advanced theming (or rendering arbitrary objects
as dropdown options) the library provides [CustomDropdown] component, which
implements the dropdown from scratch based on the simple `<div>` elements.

Both dropdown implementation provide similar API, with just slight changes
documented below.

import CodeBlock from '@theme/CodeBlock';
import Example from '../../../src/components/DropdownExample';
import exampleCode from '!!raw-loader!../../../src/components/DropdownExample';

:::note Demo
<Example />
:::

<details>
  <summary>Demo Source Code</summary>

  <CodeBlock className="language-jsx">{exampleCode}</CodeBlock>
</details>

:::info
If current `value` does not match any provided (and filtered, if `filter` is set)
option, [Dropdown] will add an extra &laquo;invalid&raquo; option to represent
current `value`. This ensures [Dropdown] correctly displays such `value` when it
is closed, rather than displaying the first valid option, not matching the actual
`value`. In this scenario, when [Dropdown] is opened this &laquo;invalid&raquo;
option is hidden from the list of valid selections in browsers that support it
(_e.g._ Chrome), or it is shown as disabled (and is non-selectable) in other
browsers (_e.g._ Safari). The CSS styling for this hidden &laquo;invalid&raquo;
option can be modified via the `hiddenOption` theme key.
:::

## Properties
- `filter` - **function** - Options filter function. When provided, only those
  elements of `options` list will be used by the dropdown, for which this filter
  function returns **true**.
- `label` &mdash; **React.ReactNode** &mdash; Dropdown label.

- `onChange` &mdash; **function** &mdash; Selection event handler.

  For native [Dropdown] its signature is **React.ChangeEventHandler&lt;HTMLSelectElement&gt;**,
  _i.e._ you want to pass in something like `(e) => setValue(e.target.value)`.

  For [CustomDropdown] its singature is just **(newValue: number | string) => void**,
  _i.e._ you want to pass in something like `(v) => setValue(v)`, or just
  a `setValue` setter directly.

- `options` &mdash; **Array&lt;[DropdownOption] | number | string&gt;** &mdash;
  An array of dropdown
  options. It is fine to intermix [DropdownOption] and string items within
  the same option list. For string items the option value and name will be
  the same.

- `testId` &mdash; **string** &mdash; This value is assigned to
  the `data-testid` attribute of the dropdown's underlying `<select>` element,
  to facilitate testing with [testing-library]. It is optimized out from
  production builds.

- `theme` - [DropdownTheme] - _Ad hoc_ theme.
- `value` &mdash; **number** | **string** &mdash; The currently selected value.
- Other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

### DropdownOption
Represents a single option inside [Dropdown] component. It is an object with
the following properties:

- `name`
  - For native [Dropdown] it should be **string**.
  - For [CustomDropdown] it can be any **React.ReactNode**.

  In both cases if `name` is omitted, the `value` is used as the name instead.

- `value` &mdash; **number** | **string** &mdash; Option value.

### DropdownTheme

See [React Themes] docs to learn how component theming works. The valid theme
keys for [Dropdown] are:
- `arrow` &mdash; Dropdown arrow.
- `container` &mdash; The root component container, which wraps both
  the optional label (if any), and the actual dropdown assembly.
- `dropdown` &mdash; The dropdown assembly, which holds the `<select>` element,
  and a&nbsp;custom arrow.
- `hiddenOption` &mdash; The "hidden option" element, which is rendered when
  the current dropdown value is _undefined_.

- `invalid` &mdash; The corresponding classes are added to
  the underlying `<select>` element (in addition to the classes corresponding
  to the `select` key below) if the current dropdown's value does not match any
  of provided options (and, thus, it is invalid).

- `label` &mdash; The optional dropdown label.
- `option` &mdash; Each option element.
- `select` &mdash; The underlying `<select>` element.

[CustomDropdown]: /docs/api/components/customdropdown
[Dropdown]: /docs/api/components/dropdown
[DropdownOption]: #dropdownoption
[DropdownTheme]: #dropdowntheme
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[testing-library]: https://testing-library.com

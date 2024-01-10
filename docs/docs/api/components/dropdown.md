# Dropdown

```jsx
import { Dropdown } from '@dr.pogodin/react-utils';
```

The [Dropdown] component implements a dropdown input themed using [React Themes]
library. Under the hood it still relies on the standard `<select>` element, thus
the styling support is somewhat limited, but on the other hand it is natively
integrated with browsers.

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
- `label` - **string** - Dropdown label.
- `onChange` - **function** - Selection event handler.
- `options` - **Array&lt;[DropdownOption] | string&gt;** - An array of dropdown
  options. It is fine to intermix [DropdownOption] and string items within
  the same option list. For string items the option value and name will be
  the same.
- `theme` - [DropdownTheme] - _Ad hoc_ theme.
- `value` - **string** - The currently selected value.
- Other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

### DropdownOption
Represents a single option inside [Dropdown] component. It is an object with
the following properties:
- `name` - **string** - The option name to render in UI. When not given
  the `value` is used as the name.
- `value` - **string** - Option value.

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
- `label` &mdash; The optional dropdown label.
- `option` &mdash; Each option element.
- `select` &mdash; The underlying `<select>` element.

[Dropdown]: /docs/api/components/dropdown
[DropdownOption]: #dropdownoption
[DropdownTheme]: #dropdowntheme
[React Themes]: https://dr.pogodin.studio/docs/react-themes

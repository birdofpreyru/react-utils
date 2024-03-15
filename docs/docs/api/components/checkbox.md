# Checkbox

```js
import { Checkbox } from '@dr.pogodin/react-utils';
```

The [Checkbox] component implements checkboxes themed with [React Themes].

import CheckboxExample from '../../../src/components/CheckboxExample';

:::note Demo
<CheckboxExample />

See [the source code below][Examples]
:::

## Properties

- `checked` - **boolean** - Checkbox value.
- `label` &mdash; **React.ReactNode** &mdash; Checkbox label.
- `onChange` - **function** - State change handler.
- `theme` - [CheckboxTheme] - _Ad hoc_ [React Themes] theme.
- Accepts other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

## CheckboxTheme

Valid theme keys are:
- `checkbox` - Applied to the underlying checkbox `<input>` element.
- `container` - Applied to the root checkbox element.
- `label` &mdash; Applied to the checkbox label element.

See [React Themes] documentation for details on visual component theming.

## Examples

import CodeBlock from '@theme/CodeBlock';
import exampleCode from '!!raw-loader!!../../../src/components/CheckboxExample';

<CodeBlock className="language-jsx">{exampleCode}</CodeBlock>

[Checkbox]: /docs/api/components/checkbox
[CheckboxTheme]: #checkboxtheme
[Examples]: #examples
[React Themes]: https://dr.pogodin.studio/docs/react-themes

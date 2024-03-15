# Switch
```ts
import { Switch } from '@dr.pogodin/react-utils';
```
The [Switch] component allows to select one of multiple options displayed
side-by-side.

import CodeBlock from '@theme/CodeBlock';
import Example from '../../../src/components/SwitchExample';
import exampleCode from '!!raw-loader!../../../src/components/SwitchExample';

:::info Demo
<Example />
:::

<details>
  <summary>Demo Source Code</summary>

  <CodeBlock className="language-tsx">{exampleCode}</CodeBlock>
</details>

## Properties
**Optional:**
- `label` &mdash; **React.ReactNode** &mdash; Switch label.
- `onChange` &mdash; **(value: string) => void** &mdash; Switch handler.
- `options` &mdash; **Array&lt;[OptionT]|string&gt;** An array of switch options.
  It is fine to inter-mix [OptionT] and string items within this prop; for string
  options its name and value will be the same.
- `theme` &mdash; [SwitchThemeT] &mdash; _Ad hoc_ theme.
- `value` &mdash; **string** &mdash; Selected option.
- Other [props of themed components].

### OptionT
The type of a single option object within [Switch]. It has the following fields:
- `name` &mdash; **React.ReactNode | undefined** &mdash; The element to render
  to represent the option. If not given, the `value` will be used instead.
- `value` &mdash; **string** &mdash; Option value.

### SwitchThemeT
See [React Themes] docs for details of component theming. The valid theme keys
for [Switch] are:
- `container` &mdash; Applied to the outer [Switch] container, which includes
  both the switch, and its optional label.
- `label` &mdash; Applied to the label.
- `option` &mdash; Applied to each option.
- `selected` &mdash; Applied to the currently selected option.
- `switch` &mdash; Applied to the switch component (container of all shown options).

[OptionT]: #optiont
[props of themed components]: https://dr.pogodin.studio/docs/react-themes/docs/api/components#themedcomponent
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[Switch]: #

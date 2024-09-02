# Checkbox

```js
import { Checkbox } from '@dr.pogodin/react-utils';
```

The [Checkbox] component implements checkboxes themed with [React Themes].

import CodeBlock from '@theme/CodeBlock';
import exampleCode from '!!raw-loader!!../../../src/components/CheckboxExample';
import CheckboxExample from '../../../src/components/CheckboxExample';

<details>
<summary>
**Demo** (expand to see the source code)
<CheckboxExample />
</summary>

<CodeBlock className="language-tsx">{exampleCode}</CodeBlock>
</details>

## Properties

- `checked` &mdash; **boolean** | "`indeterminate`" | **undefined** &mdash;
  Checkbox value.

  :::info
  To implement `indeterminate` state we don't use
  [`indeterminate` property](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes)
  of the underlying `<input>` element, we rather simply append `indeterminate`
  theme class to the underlying `<input>` and style it accordingly.

  There won't be a way to detect the current &laquo;indeterminate&raquo; state
  of the checkbox from the event argument of `onChange` hook, it will be necessary
  to fully manage it via the external state.
  :::

- `disabled` &mdash; **boolean** | **undefined** &mdash; Disables the checkbox.

- `label` &mdash; **React.ReactNode** &mdash; Checkbox label.
- `onChange` &mdash; **function** &mdash; State change handler.

- `testId` &mdash; **string** | **undefined** &mdash; Sets `data-testid`
  attribute to the underlying `<input>` element; it is intended to faciliate
  testing with `@testing-library/dom`. Ignored in production builds.

- `theme` &mdash; [CheckboxTheme] &mdash; _Ad hoc_ [React Themes] theme.
- Accepts other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

## CheckboxTheme

Valid theme keys are:
- `checkbox` &mdash; Applied to the underlying checkbox `<input>` element.
- `container` &mdash; Applied to the root checkbox element.

- `disabled` &mdash; Applied to the root checkbox container if the component
  is disabled.

- `indeterminate` &mdash; Applied to the underlying `<input>` element when
  the component is in the &laquo;indeterminate&raquo; state.

- `label` &mdash; Applied to the checkbox label element.

See [React Themes] documentation for details on visual component theming.

[Checkbox]: /docs/api/components/checkbox
[CheckboxTheme]: #checkboxtheme
[React Themes]: https://dr.pogodin.studio/docs/react-themes

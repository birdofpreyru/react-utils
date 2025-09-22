# TextArea
```tsx
import { TextArea } from '@dr.pogodin/react-utils';
```
The [TextArea] component implements an auto-resizeable text area,
_i.e._ a version of the standard `<textarea>` that automatically expands
and shrinks its height as its content is modified.

It is implemented as a themable component, using [React Themes] library.

import CodeBlock from '@theme/CodeBlock';
import TextAreaExample from '../../../src/components/TextAreaExample';
import exampleCode from '!!raw-loader!../../../src/components/TextAreaExample';

:::note Demo
<TextAreaExample />
:::
<details>
<summary>Demo Source Code</summary>

<CodeBlock className="language-tsx">{exampleCode}</CodeBlock>
</details>

## Properties

**Optional**

- `disabled` &mdash; **boolean** &mdash; Disables the text area.

- `error` &mdash; **ReactNode** &mdash; Optional. If a truthy value the `error`
  theme key is added to the root element of the component, and unless the value
  is _true_ it is also rendered right after the inner `<textarea>`element,
  wrapped into a `<div>` with `errorMessage` theme key (thus, setting it equal
  _true_ allows to apply `error` theme key to the root element, without adding
  the error message `<div>`).

- `label` &mdash; **string** &mdash; Text area label.

- `onBlur` &mdash; **React.FocusEventHandler&lt;HTMLTextAreaElement&gt;**
  &mdash; [FocusEvent handler](https://react.dev/reference/react-dom/components/common#focusevent-handler).

- `onChange` &mdash; **React.ChangeEventHandler&lt;HTMLTextAreaElemen&gt;** &mdash;
  [Event handler](https://react.dev/reference/react-dom/components/common#event-handler)
  for area content changes. It should be provided for managed text area.
- `onKeyDown` &mdash; **React.KeyboardEventHandler&lt;HTMLTextAreaElemen&gt;**
  &mdash; [KeyboardEvent handler](https://react.dev/reference/react-dom/components/common#keyboardevent-handler).
- `placeholder` &mdash; **string** &mdash; Text area placeholder.

- `testId` &mdash; **string** &mdash; This value is assigned to
  the `data-testid` attribute of the underlying `<textarea>` element,
  to facilitate the testing with [testing-library]. It is optimized out from
  production builds.

- `theme` &mdash; [TextAreaTheme] &mdash; _Ad hoc_ [React Themes] theme.
- `value` &mdash; **string** &mdash; Text area value, it should be
  provided to use the text area as a managed input.
- Other [ThemedComponent] props.

## TextAreaTheme
[TextAreaTheme]: #textareatheme
See [React Themes] docs to learn how themed components work, and how they can be
themed. The valid theme keys for [TextArea] are:

- `container` &mdash; The root container of the component.

- `error` &mdash; Added to the root element when `error` prop value is thruthy.

- `errorMessage` &mdash; Applied to the `<div>` wrapper of the error message,
  when it is rendered (see `error` prop documentation for details).

- `hidden` &mdash; The hidden `<textarea>` element, which is used internally
  for measurement purposes. This style is applied to that element in addition
  to the `textarea` style below.

- `label` &mdash; The optional `div` element with the label.

- `textarea` &mdash; The underlying `<textarea>` element, and this style is also
  applied to the second, hidden `<textarea>` element, which is used internally
  for measurement purposes.

[React Themes]: https://dr.pogodin.studio/docs/react-themes
[testing-library]: https://testing-library.com
[TextArea]: /docs/api/components/textarea
[ThemedComponent]: https://dr.pogodin.studio/docs/react-themes/docs/api/components#themedcomponent

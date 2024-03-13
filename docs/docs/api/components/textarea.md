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
- `disabled` &mdash; **boolean** &mdash; Optional. Disables the text area.
- `onChange` &mdash; **React.ChangeEventHandler&lt;HTMLTextAreaElemen&gt;** &mdash;
  [Event handler](https://react.dev/reference/react-dom/components/common#event-handler)
  for area content changes. It is optional, and it should be provided for
  managed text area.
- `onKeyDown` &mdash; **React.KeyboardEventHandler&lt;HTMLTextAreaElemen&gt;**
  &mdash; Optional
  [KeyboardEvent handler](https://react.dev/reference/react-dom/components/common#keyboardevent-handler).
- `placeholder` &mdash; **string** &mdash; Optional. Text area placeholder.
- `theme` &mdash; [TextAreaTheme] &mdash; _Ad hoc_ [React Themes] theme.
- `value` &mdash; **string** &mdash; Optional. Text area value, it should be
  provided to use the text area as a managed input.
- Other [ThemedComponent] props.

## TextAreaTheme
[TextAreaTheme]: #textareatheme
See [React Themes] docs to learn how themed components work, and how they can be
themed. The valid theme keys for [TextArea] are:
- `container` &mdash; The root container of the component.
- `hidden` &mdash; The hidden `<textarea>` element, which is used internally
  for measurement purposes. This style is applied to that element in addition
  to the `textarea` style below.
- `textarea` &mdash; The underlying `<textarea>` element, and this style is also
  applied to the second, hidden `<textarea>` element, which is used internally
  for measurement purposes.

[React Themes]: https://dr.pogodin.studio/docs/react-themes
[TextArea]: /docs/api/components/textarea
[ThemedComponent]: https://dr.pogodin.studio/docs/react-themes/docs/api/components#themedcomponent

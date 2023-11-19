# Button

```jsx
import { Button } from '@dr.pogodin/react-utils';
```

The [Button] component implements themeable buttons, and button-line links
(elements that look like buttons, but behave as links) in the same uniform manner.

import Example from '../../../src/components/ButtonsExample';

:::note Demo
<Example />

See [the source code below][Examples].
:::

A [Button] instance is rendered in different ways:
1.  As `<div>` element if the button is disabled.
2.  As [Link] if its `to` property is set, and the button is not disabled.
3.  As `<div>` element in any other case.

The button is themed using [React Themes] library, with the default theme
ensuring consistent visual appearance of the button in all different rendering
cases.

## Properties
- `active` - **boolean** - Enforces active button state (even when the button is
  not active by the regular criteria).
- `children` - **React Node** - Component children, if any, are rendered as
  the button's content.
- `disabled` - **boolean** - Disables the button.
- `enforceA` - **boolean** - If the button is rendered as [Link] this flag
  enforces it to be rendered as a simple `<a>` element (external link) rather
  than an internal link. See [Link] documentation for details.

- `onClick` &mdash; **function** &mdash; Mouse click event handler. It is also
  triggered when the button is focused and &laquo;Enter&raquo; key is pressed.
  In both cases it receieve corresponding event (mouse or keyboard) as its
  argument.

- `onMouseDown` - **function** - Mouse down event handler.
- `openNewTab` - **boolean** - If the button is rendered as [Link] this flag
  opts to open the link in a new tab.
- `replace` - **boolean** - If the button is rendered as [Link], and the target
  URL is internal, this flag opts for the new route to replace the last record
  in the navigation history, instead of being pushed as a new entry into the nav
  history stack.
- `theme` - [ButtonTheme](#buttontheme) - _Ad hoc_ button theme.
- `to` - **object | string** - If specified, the button is rendered as [Link]
  (if not disabled), and beside the visual appearance as a button it acts as
  a link pointing the target URL.
- Accepts other
  [props of themed components](https://dr.pogodin.studio/docs/react-themes/docs/api/components#themedcomponent).

## ButtonTheme

Valid [Button] theme keys are:

- `active` - Applied to buttons in active state.
- `button` - Applied to all button instaces.
- `disabled` - Applied to disabled buttons.

See [React Themes] documentation for theming details.

## Examples

import CodeBlock from '@theme/CodeBlock';
import exampleCode from '!!raw-loader!../../../src/components/ButtonsExample';

<CodeBlock className="language-jsx">{exampleCode}</CodeBlock>

[Button]: /docs/api/components/button
[Examples]: #examples
[Link]: /docs/api/components/link
[React Themes]: https://dr.pogodin.studio/docs/react-themes

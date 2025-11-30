# Button

```jsx
import { Button, BaseButton } from '@dr.pogodin/react-utils';
```

The [Button] component implements themeable buttons, and button-line links
(elements that look like buttons, but behave as links) in the same uniform
manner. The base, non-themed version of the component is also exported under
the **BaseButton** name.

import CodeBlock from '@theme/CodeBlock';
import Example from '../../../src/components/ButtonsExample';
import exampleCode from '!!raw-loader!../../../src/components/ButtonsExample';

<details>
<summary>**Demo** (expand to see the source code)<br /><Example /></summary>
<CodeBlock className="language-jsx">{exampleCode}</CodeBlock>
</details>

A [Button] instance is rendered in different ways:
1.  As `<div>` element if the button is disabled.
2.  As [Link] if its `to` property is set, and the button is not disabled.
3.  As `<div>` element in any other case.

The button is themed using [React Themes] library, with the default theme
ensuring consistent visual appearance of the button in all different rendering
cases.

## Properties
- `active` &mdash; **boolean** &mdash; Enforces active button state (even when the button is
  not active by the regular criteria).
- `children` &mdash; **ReactNode** &mdash; Component children, if any, are rendered as
  the button's content.
- `disabled` &mdash; **boolean** &mdash; Disables the button.

- `keepScrollPosition` &mdash; **boolean** &mdash; Optional. When _true_, and
  the button is rendered as the [Link] component, this flag is passed down to
  the [Link], opting out of the page auto-scroll to the top when the button is
  clicked.

- `enforceA` &mdash; **boolean** &mdash; If the button is rendered as [Link] this flag
  enforces it to be rendered as a simple `<a>` element (external link) rather
  than an internal link. See [Link] documentation for details.

- `onClick` &mdash; [KeyboardEventHandler] & [MouseEventHandler] &mdash;
  Click event handler. It is triggered both when the button is clicked by mouse,
  and when it is focused, and &laquo;Enter&raquo; key is pressed on the keyboard.
  In either case it receives the corresponding event (keyboard, or mouse), as its
  only argument.

- `onKeyDown` &mdash; [KeyboardEventHandler] &mdash; &laquo;Key down&raquo;
  event handler.

  :::caution
  At the moment `onKeyDown` prop is only supported by proper button components,
  and not by &laquo;button-like&raquo; links (instances of [Button] using `to`
  prop). For &laquo;button-like&raquo; links `onKeyDown` event handler is not
  called.
  :::

  :::tip
  If no `onKeyDown` prop is provided, but `onClick` is, the `onKeyDown` defaults
  to trigger `onClick` when `"Enter"` key is pressed.
  :::

- `onKeyDown` &mdash; [KeyboardEventHandler] &mdash; &laquo;Key up&raquo; event handler.

- `onMouseDown` &mdash; [MouseEventHandler] &mdash; Mouse down event handler.

- `onMouseUp` &mdash; [MouseEventHandler] &mdash; Mouse up event handler.

- `onPointerDown` &mdash; [PointerEventHandler] &mdash; Pointer down event
  handler.

- `onPointerUp` &mdash; [PointerEventHandler] &mdash; Pointer up event handler.

- `openNewTab` &mdash; **boolean** &mdash; If the button is rendered as [Link] this flag
  opts to open the link in a new tab.
- `replace` &mdash; **boolean** &mdash; If the button is rendered as [Link], and the target
  URL is internal, this flag opts for the new route to replace the last record
  in the navigation history, instead of being pushed as a new entry into the nav
  history stack.

- `testId` &mdash; **string** &mdash; This value is assigned to
  the `data-testid` attribute of the underlying button element,
  to facilitate testing with [testing-library]. It is optimized out from
  production builds.

- `theme` &mdash; [ButtonTheme](#buttontheme) &mdash; _Ad hoc_ button theme.
- `to` &mdash; **object | string** &mdash; If specified, the button is rendered as [Link]
  (if not disabled), and beside the visual appearance as a button it acts as
  a link pointing the target URL.

## ButtonTheme

Valid [Button] theme keys are:

- `active` &mdash; Applied to buttons in active state.
- `button` &mdash; Applied to all button instaces.
- `disabled` &mdash; Applied to disabled buttons.

See [React Themes] documentation for theming details.

[Button]: /docs/api/components/button
[KeyboardEventHandler]: https://react.dev/reference/react-dom/components/common#keyboardevent-handler
[Link]: /docs/api/components/link
[MouseEventHandler]: https://react.dev/reference/react-dom/components/common#mouseevent-handler
[PointerEventHandler]: https://react.dev/reference/react-dom/components/common#pointerevent-handler
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[testing-library]: https://testing-library.com

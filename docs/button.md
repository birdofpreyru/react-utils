# Button
```jsx
import React from 'react';
import { Button } from '@dr.pogodin/react-utils';

export default function ButtonDemo() {
  return (
    <div>
      <Button onClick={() => alert('Button Clicked')}>Button</Button>
      <Button to="https://dr.pogodin.studio" openNewTab>
        Button-Like Link
      </Button>
      <Button disabled>Disabled Button</Button>
      <Button active>Forced-Active Button</Button>
    </div>
  );
}
```
`<Button>` handles buttons, and button-like links (elements which look like
buttons, but behave as links) in the same uniform manner.
It is [themed](react-themes.md) component, which look can be altered via
_ad hoc_ and context styles.

Under the hood, a `<Button>` instance is rendered as:
1.  `<div>` when the button is disabled. It helps to ensure exactly
    the same style of disabled buttons and button-like links;
2.  [`<Link>`](link-and-navlink.md) when `to` property is set.
    This takes care about internal and external links.
3.  `<div>` element, otherwise. `<Link>` component could also play the button
    role, but is more efficient to use `<div>` in this case.

### Reference

- `<Button>` &ndash; Themed button. The context style is picked up from
  the `Button` context theme.

  **Children**

  Optional. Component children are rendered as the button content.

  **Properties**

  - `[active]` (_Boolean_) &ndash; Optional. Set `true` to render the button as
    active, even if it is not active otherwise.s

  - `[disabled]` (_Boolean_) &ndash; Optional. Set `true` to disable the button.

  - `[enforceA]` (_Boolean_) &ndash; Optional. When the button is rendered
    as `<Link>`, this prop enforces it to be rendered as a simple `<a>`
    element (external link), rather than React router's internal link.
    See [`<Link>` documentation](link-and-navlink.md) to learn when
    links are rendered as `<a>` by default.

  - `[onClick]` (_Function_) &ndash; Optional. Click event handler.

  - `[onMouseDown]` (_Function_) &ndash; Optional. Mouse down event handler.

  - `[openNewTab]` (_Boolean_) &ndash; Optional. Set `true` to open link in
    the new tab.

  - `[replace]` (_Boolean_) &ndash; Optional. When the button is rendered as
    `<Link>`, and the target URL is internal, this property tells that
    the new route should replace the last record in the browser's history,
    rather than to be pushed as a new entry into the history stack.

  - `[theme]` (_Object_) &ndash; Optional mapping of CSS classes to add
    to different button pieces.

    - `[theme.button]` &ndash; To the root button element in all cases.
    - `[theme.disabled]` &ndash; To the root button element, in disabled state.
    - `[theme.link]` &ndash; To the root button element, if button is rendered
      as `<Link>`.
  
  - `[to]` (_Object_ or _String_) &ndash; Optional. If specified, the button
    will be rendered as `<Link>` (if not disabled), and it will point to
    the specified location or URL.

  - [Other themed component properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

- **Deprecated** `<BaseButton>` &ndash; Non-themed button component.
  The `<Button>` itself is a themed `<BaseButton>`. You can use it to create
  special buttons with different default themes, e.g.

  ```jsx
  import { BaseButton, themed } from '@dr.pogodin/react-utils';
  import dangerButtonTheme from 'path/to/danger-button-theme.scss';

  export DangerButton = themed('DangerButton', dangerButtonTheme)(BaseButton);
  ```
  Apart of visual differences, resuling `<DangerButton>` will work exactly as
  `<Button>`.

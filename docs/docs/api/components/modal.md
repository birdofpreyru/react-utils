# Modal
```jsx
import { Modal, BaseModal } from '@dr.pogodin/react-utils';
```
The [Modal] component implements a simple modal window, visually themed using
[React Themes] library. The base non-themed version of the component is also
exposed as the **BaseModal** component.

import CodeBlock from '@theme/CodeBlock';
import ModalExample from '../../../src/components/ModalExample';
import exampleCode from '!!raw-loader!../../../src/components/ModalExample';

:::note Demo
<ModalExample />
:::

<details>
  <summary>Demo Source Code</summary>
  <CodeBlock className="language-tsx">{exampleCode}</CodeBlock>
</details>

:::info
By default, an open modal adds a CSS class with `overflow: hidden` rule
to the document `<body>`, which disables page scrolling (and hides scrollbars)
when a modal is open. This can be opted out by `dontDisableScrolling` prop;
also `cancelOnScrolling` allows to bind `onCancel` callback (if any)
to the window scrolling events when the modal is displayed,
:::

## Properties

**Optional:**
- `cancelOnScrolling` &mdash; **boolean** &mdash; Opts-in to watch scrolling
  events on the browser window, and trigger `onCancel` callback (if provided)
  when the scrolling is detected.
- `children` &mdash; **React.ReactNode** &mdash; Modal content.
- `dontDisableScrolling` &mdash; **boolean** &mdash; Opt-out from disabling
  the scrolling on the window when the modal is open.
- `onCancel` &mdash; **function** &mdash; The callback to trigger when user
  clicks outside the modal window, or presses &laquo;escape&raquo; key.
  It is expected to close the modal.
- `overlayStyle` &mdash; **React.CSSProperties** &mdash; Inline style object
  to pass to the modal overlay.
- `style` &mdash; **React.CSSProperties** &mdash; Inline style object
  to pass to the modal container.

- `testId` &mdash; **string** | **undefined** &mdash; This value is assigned to
  the `data-testid` attribute of the modal's container, to facilitate testing
  with [testing-library]. It is optimized out from production builds.

- `testIdForOverlay` &mdash; **string** | **undefined** &mdash; Similar to
  `testId`, but attaches `data-testid` to the modal overlay over the page
  content.

- `theme` &mdash; [ModalTheme] &mdash; _Ad hoc_ visual theme.
- Other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)

:::caution Deprecated Properties
- `containerStyle` &mdash; **React.CSSProperties** &mdash; Inline style object
  to pass to the modal container &mdash; Use `style` property instead.
:::

### ModalTheme
See [React Themes] documentation to learn how the visual theming works.
The valid theme keys for [Modal] component are:
- `container` - The modal's window container.
- `overlay` - The semi-transparent overlay that shades the background under
  the open modal, and handles clicks outside the modal when that is open.

:::tip
The default `z-index` of modal overlay (998) is exposed from the library as
`$zIndexOfDefaultModalOverlay` SCSS variable in [SCSS Mixins]. Any UI element
with lower `z-index` will be effectively blocked when the modal is open.
By default, the main modal container itself has its `z-index` by 1 larger than
`$zIndexOfDefaultModalOverlay` (_i.e._ 999).
:::

[SCSS Mixins]: https://dr.pogodin.studio/docs/react-utils/docs/api/styles/mixins
[Modal]: /docs/api/components/modal
[ModalTheme]: #modaltheme
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[testing-library]: https://testing-library.com

# Modal
```jsx
import { Modal, BaseModal } from '@dr.pogodin/react-utils';
```
The [Modal] component implements a simple modal window, visually themed using
[React Themes] library. The base non-themed version of the component is also
exposed as the **BaseModal** component.

import ModalExample from '../../../src/components/ModalExample';

:::danger Live Example Is Temporarily Removed
The live example is temporarily removed, until Docusaurus is fully compatible with React v18+.
:::

## Properties
- `children` - **React.Node** - Component children, if any, are rendered as
  the modal's content.
- `onCancel` - **function** - The callback to trigger when user clicks outside
  the modal window, or presses "escape" key. It is expected to close the modal.
- `theme` - [ModalTheme] - _Ad hoc_ visual theme.
- Other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)

### ModalTheme
See [React Themes] documentation to learn how the visual theming works.
The valid theme keys for [Modal] component are:
- `container` - The modal's window container.
- `overlay` - The semi-transparent overlay that shades the background under
  the open modal, and handles clicks outside the modal when that is open.

## Example

import CodeBlock from '@theme/CodeBlock';
import example from '!!raw-loader!../../../src/components/ModalExample';

<CodeBlock className="language-jsx">{example}</CodeBlock>

[Example]: #example
[Modal]: /docs/api/components/modal
[ModalTheme]: #modaltheme
[React Themes]: https://dr.pogodin.studio/docs/react-themes

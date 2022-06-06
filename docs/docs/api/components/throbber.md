# Throbber
```jsx
import { Throbber } from '@dr.pogodin/react-utils';
```
The [Throbber] component is a simple "action in progress" indicator, themed
using [React Themes] library. It is rendered as three bouncing circles, and
can be further themed to a certain degree.

import Throbber from '../../../src/components/Throbber';

:::danger Demo
The live example is temporarily removed, until Docusaurus is fully
compatible with React **v18+**.
:::

## Properties

- `theme` - [ThrobberTheme] - _Ad hoc_ [React Themes] theme.
- Other [props of a themed component](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

## ThrobberTheme
See [React Themes] docs to learn how themed components work and how they can be
themed. The valid theme keys for [Throbber] are:
- `container` - The root component element.
- `circle` - Applied to each of the bouncing circles.

[React Themes]: https://dr.pogodin.studio/docs/react-themes
[Throbber]: /docs/api/components/throbber
[ThrobberTheme]: #throbbertheme

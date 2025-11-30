# Throbber
```jsx
import { Throbber } from '@dr.pogodin/react-utils';
```
The [Throbber] component is a simple "action in progress" indicator, themed
using [React Themes] library. It is rendered as three bouncing circles, and
can be further themed to a certain degree.

import Throbber from '../../../src/components/Throbber';

:::note Demo
By default `<Throbber />` renders as three black bouncing circles: <Throbber />,
which can be further styled to a certain degree using [React Themes] mechanics.
:::

## Properties

- `theme` &mdash; [ThrobberTheme] &mdash; _Ad hoc_ [React Themes] theme.

- `themePriority` &mdash; [PRIORITY] &mdash; Optional. Allows to override
  themes priority for the component. Defaults `PRIORITY.ADHOC_CONTEXT_DEFAULT`.

## ThrobberTheme
See [React Themes] docs to learn how themed components work and how they can be
themed. The valid theme keys for [Throbber] are:
- `container` &mdash; The root component element.
- `circle` &mdash; Applied to each of the bouncing circles.

[PRIORITY]: https://dr.pogodin.studio/docs/react-themes/docs/api/enums/priority
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[Throbber]: /docs/api/components/throbber
[ThrobberTheme]: #throbbertheme

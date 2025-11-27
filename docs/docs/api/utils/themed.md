---
sidebar_class_name: deprecated
---

# themed
:::danger Deprecated
Aliases for [react-themes][React Themes] library were changed in the library
version **v1.48.0**, and the corresponding documentation page has been moved to
[React Themes](/docs/api/utils/react-themes):
- `themed` &rArr; Removed, use `useTheme()` instead.
- `themed.COMPOSE` &rArr; `THEME_COMPOSE`.
- `themed.PRIORITY` &rArr; `THEME_PRIORITY`.
:::

# Original Documentation
_Valid for the library versions before **v1.48.0**_.

```jsx
import { themed } from '@dr.pogodin/react-utils';
```
These exports encapsulate [React Themes] library for visual styling of ReactJS
components with theme composition. They are just aliases for exports from
[React Themes]:

| **react-utils** export | aliased **react-themes** export |
| --- | --- |
| `themed` | [themed()](https://dr.pogodin.studio/docs/react-themes/docs/api/functions#themed) |
| `themed.COMPOSE` | [COMPOSE](https://dr.pogodin.studio/docs/react-themes/docs/api/constants#compose) |
| `themed.PRIORITY` | [PRIORITY](https://dr.pogodin.studio/docs/react-themes/docs/api/constants#priority) |
| `ThemeProvider` | [ThemeProvider](https://dr.pogodin.studio/docs/react-themes/docs/api/components#themeprovider) |

[React Themes]: https://dr.pogodin.studio/docs/react-themes
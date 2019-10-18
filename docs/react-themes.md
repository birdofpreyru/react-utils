# React Themes

```jsx
import { themed, ThemeProvider } from '@dr.pogodin/react-utils';
```

Encapsulates
[`dr.pogodin/react-themes`](https://www.npmjs.com/package/@dr.pogodin/react-themes)
library for React component styling with theme composition. For convenience,
the aliases are provided for react themes exports. They work the same as
specified in the `react-themes` documentation, and `react-utils` configration is
fully compliant with expected CSS Modules setup.

| Export from `react-utils` | Original export from `react-themes`    |
| ------------------------- | -------------------------------------- |
| `themed`                  | _default export_ (component decorator) |
| `themed.COMPOSE`          | `COMPOSE`                              |
| `themed.PRIORITY`         | `PRIORITY`                             |
| `ThemeProvider`           | `ThemeProvider`                        |

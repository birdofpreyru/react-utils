# Input
```jsx
import { Input } from '@dr.pogodin/react-utils';
```
The [Input] component is a standard text input, based on HTML `<input>` element,
and themed using [React Themes] library.

## Properties

- `label` &mdash; **React.ReactNode** &mdash; Input component label
  (to be rendered next to the input, if provided).
- `theme` - [InputTheme] - _Ad hoc_ visual theme.
- Other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).
- Any other props are passed down to the underlying HTML `<input>` element.

## InputTheme

See [React Themes] docs to learn about component theming. The valid theme keys
of [Input] component are:
- `container` - The root component element.
- `input` - The underlying HTML `<input>` element.
- `label` &mdash; The label element.

[Input]: #
[InputTheme]: #inputtheme
[React Themes]: https://dr.pogodin.studio/docs/react-themes

# Input
```jsx
import { Input } from '@dr.pogodin/react-utils';
```
The [Input] component is a standard text input, based on HTML `<input>` element,
and themed using [React Themes] library.

## Properties

- `label` &mdash; **React.ReactNode** &mdash; Input component label
  (to be rendered next to the input, if provided).

- `testId` &mdash; **string | undefined** &mdash; Optional. If provided, it is
  set as the value of the `data-testid` attribute of the underlying `<input>`
  element, to facilitate its retrieval by [Testing Library]'s [getByTestId()]
  methods in test evnironments. It is optimized out from production builds.

- `theme` - [InputTheme] - _Ad hoc_ visual theme.
- Other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).
- Any other props are passed down to the underlying HTML `<input>` element.

## InputTheme

See [React Themes] docs to learn about component theming. The valid theme keys
of [Input] component are:
- `container` &mdash; The root component element.

- `empty` &mdash; Added to the root component element when `value` prop
  is falsy.
  :::caution
  At the moment, it is always added to non-managed inputs.
  :::

- `input` &mdash; The underlying HTML `<input>` element.
- `label` &mdash; The label element.

[getByTestId()]: https://testing-library.com/docs/queries/bytestid
[Input]: #
[InputTheme]: #inputtheme
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[Testing Library]: https://testing-library.com

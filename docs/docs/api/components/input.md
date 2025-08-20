# Input
```jsx
import { Input } from '@dr.pogodin/react-utils';
```
The [Input] component is a standard text input, based on HTML `<input>` element,
and themed using [React Themes] library.

## Properties

- `children` &mdash; **ReactNode** &mdash; Optional. If provided, it is rendered
  wrapped into a `<div>` with `children` theme key, within the root element of
  [Input], but after all its other children.

- `error` &mdash; **ReactNode** &mdash; Optional. If a truthy value
  the `error` theme key is added to the root element of the component,
  and unless the value is _true_ it is also rendered right after
  the inner `<input>` element, wrapped into a `<div>` with `errorMessage`
  theme key (thus, setting it equal _true_ allows to apply `error` theme
  ky to the root element, without adding the error message `<div>`).

- `label` &mdash; **ReactNode** &mdash; Input component label
  (to be rendered next to the input, if provided).

- `testId` &mdash; **string** | **undefined** &mdash; Optional. If provided,
  it is set as the value of the `data-testid` attribute of the underlying `<input>`
  element, to facilitate its retrieval by [Testing Library]'s [getByTestId()]
  methods in test evnironments. It is optimized out from production builds.

- `theme` &mdash; [InputTheme] &mdash; _Ad hoc_ visual theme.
- Other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).
- Any other props are passed down to the underlying HTML `<input>` element.

## InputTheme

See [React Themes] docs to learn about component theming. The valid theme keys
of [Input] component are:

- `children` &mdash; Applied to the `<div>` wrapper of additional children
  (see `children` prop).

- `container` &mdash; The root component element.

- `empty` &mdash; Added to the root component element when `value` prop
  is falsy.
  :::caution
  At the moment, it is always added to non-managed inputs.
  :::

- `error` &mdash; Added to the root component element when `error` prop value
  is truthy.

- `errorMessage` &mdash; Applied to the `<div>` wrapper of the error message,
  when it is rendered (see `error` prop documentation for details).

- `focused` &mdash; Added to the component's root element when the underlying
  HTML `<input>` element is focused.

- `input` &mdash; The underlying HTML `<input>` element.
- `label` &mdash; The label element.

[getByTestId()]: https://testing-library.com/docs/queries/bytestid
[Input]: #
[InputTheme]: #inputtheme
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[Testing Library]: https://testing-library.com

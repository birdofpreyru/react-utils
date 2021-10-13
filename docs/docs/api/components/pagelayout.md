# PageLayout
```jsx
import { PageLayout } from '@dr.pogodin/react-utils';
```
The [PageLayout] component implements a simple page layout, themed using
[React Themes] library. It keeps the main page content centered in a column of
limited width, which fills entire viewport on small screens
(under `$screen-md = 1024px` size). At larger screens the main column keeps
`$screen-md` size, and it is centered at the page, surrounded by side panels,
where additional content can be displayed.

## Properties
- `children` - **React.Node** - Component children, if any, are rendered as
  the content of main layout panel.
- `leftSidePanelContent` - **React.Node** - The content for left side panel.
- `rightSidePanelContent` - **React.Node** - The content for right side panel.
- `theme` - [PageLayoutTheme] - _Ad hoc_ visual theme.
- Other [props of themed components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

### PageLayoutTheme
See [React Themes] documentation to learn how themed components work. The valid
theme keys for [PageLayout] are:
- `container` - The root container of [PageLayout].
- `mainPanel` - The main content panel.
- `sidePanel` - Applied to both side panels.
- `leftSidePanel` - Applied to the left side panel, in addition to `sidePanel`
  styling.
- `rightSidePanel` - Applied to the right side panel, in addition to `sidePanel`
  styling.

[PageLayout]: /docs/api/components/pagelayout
[React Themes]: https://dr.pogodin.studio/docs/react-themes

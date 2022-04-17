# WithTooltip
```jsx
import { WithTooltip } from '@dr.pogodin/react-utils';
```
[WithTooltip] implements a simple to use tooltip component, themed using
[React Themes] library.

:::danger Live Example Is Temporarily Removed
The live example is temporarily removed, until Docusaurus is fully
compatible with React **v18+**.
:::

## Properties
- `children` - **React.Node** - Component children are rendered in the place of
  [WithTooltip] component, and when hovered the tooltip is shown. By default
  the children are wrapped into `<div>` block with `display: inline-block`
  positioning.
- `theme` - [WithTooltipTheme] - _Ad hoc_ [React Themes] theme.
- Other [props of themed component](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

### WithTooltipTheme
See [React Themes] docs to learn how the visual theming of themed components
works. The valid theme keys for [WithTooltip] are:
- `appearance` - The animation of tooltip appearance.
- `arrow` - The open tooltip's wrapper.
- `container` - The open tooltip's container.
- `content` - The open tooltip's content.
- `wrapper` - The `<div>` wrapper created around the rendered component children.

## Examples
import CodeBlock from '@theme/CodeBlock';
import example from '!!raw-loader!../../../src/components/WithTooltipExample';

<CodeBlock className="language-jsx">{example}</CodeBlock>

[Examples]: #examples
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[WithTooltip]: /docs/api/components/withtooltip
[WithTooltipTheme]: #withtooltiptheme

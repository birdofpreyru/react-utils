# Tooltip component
```js
import { WithTooltip } from '@dr.pogodin/react-utils';
```

Implements a simple to use tooltip component, _e.g._
```js
<WithTooltip tip="This is example tooltip.">
  <p>Hover to see the tooltip.</p>
</WithTooltip>
```

It is also a [themed component](react-themes.md), thus can be flexibly restyled.

### Reference

- `<WithTooltip>` &ndash; Wraps component(s) which should show a tooltip
  when hovered, and takes care to manage the tooltip.

  **Children** \
  Children are rendered in the place of `<WithTooltip>`, and when hovered
  the tooltip is shown. By default the wrapper itself is `<div>` block with
  `display: inline-block`.

  **Properties**
  - `tip: React.node` &ndash; Anything React is able to render, _e.g._ a tooltip
    text. This will be the tooltip content.
  - Additional [themed component](#react-themes.md) properties. Theme keys are:
    `wrapper`, `tooltip`, `arrow`.
  <hr />

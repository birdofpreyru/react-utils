---
sidebar_class_name: deprecated
---

# ScalableRect
[ScalableRect]: /docs/api/components/scalablerect

:::danger Deprecated
The [ScalableRect] component has been deprecated and removed from the library
in its **v1.31.0** release. Use [aspect-ratio] CSS property instead.
:::
[aspect-ratio]: https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio

# Original Documentation
_Valid for **dr.pogodin/react-utils** versions prior to **v1.31.0**_

```jsx
import { ScalableRect } from '@dr.pogodin/react-utils';
```
The [ScalableRect] component implements a content container that keeps given
aspect ratio while it width scales to fill all available space.

## Properties
- `children` - **React.Node** - Component children, if any, are rendered as
  the component's content.
- `className` - **string** - CSS class(es) to apply to the container.
- `ratio` - **string** - Aspect ratio of the rendered container, in `W:H` format.
  Defaults to `1:1`.



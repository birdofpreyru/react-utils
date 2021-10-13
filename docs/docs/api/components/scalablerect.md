# ScalableRect
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

[ScalableRect]: /docs/api/components/scalablerect

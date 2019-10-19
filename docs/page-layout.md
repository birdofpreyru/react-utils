# Page Layout

```jsx
import { PageLayout } from '@dr.pogodin/react-utils';

export default PageLayoutDemo() {
  return (
    <PageLayout>
      Page content.
    </PageLayout>
  );
}
```

Simple and configurable page layout. It keeps the main content centered in
a column of limited width, which fills entire viewport on small screens (under
[`$screen-md`](https://github.com/birdofpreyru/react-utils/blob/master/docs/scss-mixins.md#media-mixins) = 1024px).
At larger screens the column keeps `$screen-md` size, and it is centered at
the page, surrounded by side panels, where additional content can be displayed.

The component is [themed](react-themes.md), thus its appearance can be easily
modified.

- `<PageLayout>`

  **Children**

  Optional. Children of `<PageLayout>` are rendered as the content of main
  panel.

  **Properties**

  - `[leftSidePanelContent]` (_React Node_) &ndash; Optional. The content
    to render inside the left side panel.

  - `[rightSidePanelContent]` (_React Node_) &ndash; Optional. The content
    to render inside the right side panel.

  - `[theme]` (_Object_) &ndash; Optional. _Ad hoc_ theme with CSS classes to
    add to different page layout parts:

    - `[theme.container]` &ndash; To the root container of page layout.

    - `[theme.mainPanel]` &ndash; To the main content panel.

    - `[theme.sidePanel]` &ndash; To each side panel.

    - `[theme.leftSidePanel]` &ndash; To the left side panel (in addition to
      `theme.sidePanel`, if also provided).
    
    - `[theme.rightSidePanel]` &ndash; To the right side panel (in addition to
      `theme.sidePanel`, if also provided).

  - [Other themed component properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

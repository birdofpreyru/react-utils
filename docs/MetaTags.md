```js
import { MetaTags } from '@dr.pogodin/react-utils';
```

The `<MetaTags>` component is an auxiliary wrapper around `react-helmet`, which
helps to inject meta tags (page title, a brief content description, and social
media thumbnails) into generated pages.

**IMPORTANT:** This component relies on the `domain` path of
[Global State](https://www.npmjs.com/package/@dr.pogodin/react-global-state)
containing domain of the current page. The domain is used as prefix for image
URLs.

- [Example](#example)
- [Reference](#reference)

### Example

The minimal use-case example:
```js
// Top-level app component

import React from 'react';
import { MetaTags } from '@dr.pogodin/react-utils';

export default function ApplicationRoot() {
  return (
    <>
      <MetaTags
        title="Sample website title"
        description="Just the minimal example of MetaTags usage"
      >
      {/* The actual application content here. */}
    </>
  );
}
```

It is also legal to use additional `<MetaTags>` components in the app's
component tree: meta tags content injected by these components encountered
further in the page rendering will override the same tags injected by previously
encountered `<MetaTags>` components. Thus, the instance at the app's root
provides default meta tag values, which can be override for actual pages
down in the app's tree.

### Reference

#### Properties

- `description: string` &ndash; Page description to use in the `description`
  meta tag, and as a default description of Open Graph Tags.

- `image?: string` &ndash; Optional. Pathname of thumbnail to use in the Open
  Graph Tags (`twitter:image`, and `og:image`). The value is automatically
  prefixed by the page domain, taken from `domain` path of Global State.
  By default these tags are not injected.

- `siteName?: string` &ndash; Optional. The site name to use in `twitter:site`,
  and `og:sitename` tags. By default these tags are not injected.

- `socialDescription?: string` &ndash; Optional. The site description to use in
  `twitter:description` and `og:description` meta tags. By default the value of
  `description` prop is used.

- `socialTitle?: string` &ndash; Optional. The page title to use in
  `twitter:title`, `og:title`, and `og:image:alt` tags. By default the value of
  `title` prop is used. Also the `og:image:alt` tag is only injected if `image`
  prop is present.

- `title: string` &ndash; The page name to use in the `<title>` tag. It is also
  used as the default value of `socialTitle` prop.

- `url?: string` &ndash; Optional. The page URL to use in `og:url` tag.
  By default the tag is not injected.

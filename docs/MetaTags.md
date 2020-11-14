```js
import { MetaTags } from '@dr.pogodin/react-utils';
```

The `<MetaTags>` component is an auxiliary wrapper around `react-helmet`, which
helps to inject meta tags (page title, a brief content description, and social
media thumbnails) into generated pages.

- [Example](#example)
- [Reference](#reference)

### Example

The minimal use-case example:
```js
// Top-level app component

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

- `children?: object` &ndash; Optional. React children to render at
  the `<MetaTag>` component location. If provided, it is rendered within
  the context passing down all meta tag properties of the current `<MetaTag>`
  instance. These properties can fetched within children hierarchy in
  the following way, thus facilitating tags modification by children.

  ```jsx
  import { useContext } from 'react';
  import { MetaTags } from '@dr.pogodin/react-utils';

  export default function SampleComponent() {
    const { title, description, ...rest } = useContext(MetaTags.Context);
    /* Do something with these props here, e.g. prefix the page title with
     * the component name: */
    return (
      <MetaTags title={`Sample component - ${title}`} />
    );
  }
  ```

- `description: string` &ndash; Page description to use in the `description`
  meta tag, and as a default description of Open Graph Tags.

- `image?: string` &ndash; Optional. The absolute URL of thumbnail image to use
  in Open Graph Tags (`twitter:image`, and `og:image`). By default these tags
  are not injected.

  **BEWARE:** It must be a complete, absolute URL, including the correct
  website domain and HTTP schema.

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

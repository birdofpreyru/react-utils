# MetaTags
```js
import { MetaTags } from '@dr.pogodin/react-utils';
```
The [MetaTags] component encapsulates [React Helmet] library, and helps
to inject meta tags (page title, a brief content description, social media
thumbnails, _etc._) into app pages.

When multiple [MetaTags] components are nested within the app's component tree,
meta tags content injected by the component instances encountered down the tree
overrides the content injected by previously encountered [MetaTags] instances.

## Properties
- `children` - **React.Node** - Component children, if any, are rendered at
  the component's place.
  
  All injected meta tags are passed down the children tree using context, thus
  facilitating tags modification by children. See [Using Context] example for
  details.

- `description` - **string** - Page description to use in the `description` meta
  tag, and as a default description in [Open Graph] tags.

- `image` - **string** - The absolute URL of thumbnail image to use in
  [Open Graph] tags (`twitter:image`, and `og:image`). By default these tags
  are not injected.

  **BEWARE:** The value must be a complete, absolute URL, including the correct
  website domain and HTTP schema.

- `siteName` - **string** - The site name to use in `twitter:site`,
  and `og:sitename` tags. By default these tags are not injected.

- `socialDescription` - **string** - The site description to use in
  `twitter:description` and `og:description` meta tags. By default the value of
  `description` prop is used.

- `socialTitle` - **string** - The page title to use in `twitter:title`,
  `og:title`, and `og:image:alt` tags. By default the value of `title` prop
  is used. Also the `og:image:alt` tag is only injected if `image` prop
  is present.

- `title` - **string** - The page name to use in the `<title>` tag.
  It is also used as the default value of `socialTitle` prop.

- `url` - **string** - The page URL to use in `og:url` tag. By default the tag
  is not injected.

## Examples

This is the basic example of [MetaTags] use to set website title and
description metatags.

```jsx
// Top-level app component.
import { MetaTags } from '@dr.pogodin/react-utils';
export default function ApplicationRoot() {
  return (
    <>
      <MetaTags
        title="Sample website title"
        description="Just the minimal example of MetaTags usage"
      >
      // The actual application content here.
    </>
  );
}
```

### Using Context

When multiple [MetaTags] are nested within the app's tree the [MetaTags] content
comes in handy to modify meta tags from the children components.

```jsx
import { useContext } from 'react';
import { MetaTags } from '@dr.pogodin/react-utils';

export default function SampleComponent() {
  const { title, description, ...rest } = useContext(MetaTags.Context);
  // Do something with these props here, e.g. prefix the page title with
  // the component name:
  return (
    <MetaTags title={`Sample component - ${title}`} />
  );
}
```

[MetaTags]: /docs/api/components/metatags
[Open Graph]: https://ogp.me/
[React Helmet]: https://www.npmjs.com/package/react-helmet
[Using Context]: #using-context

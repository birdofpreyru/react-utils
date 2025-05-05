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

:::note
As a part of
[v1.43.7](https://github.com/birdofpreyru/react-utils/releases/tag/v1.43.7)
library release, [MetaTags] component was moved out to
the [@dr.pogodin/react-helmet](https://github.com/birdofpreyru/react-helmet)
library, and it can now be imported as
```ts
import { MetaTags } from '@dr.pogodin/react-helmet';
```

It is still re-exported from `@dr.pogodin/react-utils` library for convenience
and to ensure backward compatibility; but beware it is now managed separately,
and [its documentation in React Helmet repo](https://github.com/birdofpreyru/react-helmet?tab=readme-ov-file#metatags)
should be considered as the source of truth in case it mismatches this document
in future.
:::

## Properties

**Required**:

- `description` &mdash; **string** &mdash; Page description to use in the `description` meta
  tag, and as a default description in [Open Graph] tags.

- `title` &mdash; **string** &mdash; The page name to use in the `<title>` tag.
  It is also used as the default value of `socialTitle` prop.

**Optional**:

- `children` &mdash; **ReactNode** &mdash; Component children, if any, are rendered at
  the component's place.
  
  All injected meta tags are passed down the children tree using context, thus
  facilitating tags modification by children. See [Using Context] example for
  details.

- `extraMetaTags` &mdash; **Array&lt;\{ content: string; name: string \}&gt;**
  &mdash; Allows to add additional, arbitrary `<meta>` tags to the page, with
  the given `content` and `name` strings.

- `image` &mdash; **string** &mdash; The absolute URL of thumbnail image to use in
  [Open Graph] tags (`twitter:image`, and `og:image`). By default these tags
  are not injected.

  **BEWARE:** The value must be a complete, absolute URL, including the correct
  website domain and HTTP schema.

- `siteName` &mdash; **string** &mdash; The site name to use in `twitter:site`,
  and `og:sitename` tags. By default these tags are not injected.

- `socialDescription` &mdash; **string** &mdash; The site description to use in
  `twitter:description` and `og:description` meta tags. By default the value of
  `description` prop is used.

- `socialTitle` &mdash; **string** &mdash; The page title to use in `twitter:title`,
  `og:title`, and `og:image:alt` tags. By default the value of `title` prop
  is used. Also the `og:image:alt` tag is only injected if `image` prop
  is present.

- `url` &mdash; **string** &mdash; The page URL to use in `og:url` tag. By default the tag
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
import { use } from 'react';
import { MetaTags } from '@dr.pogodin/react-utils';

export default function SampleComponent() {
  const { title, description, ...rest } = use(MetaTags.Context);
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

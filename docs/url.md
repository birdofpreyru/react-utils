```jsx
import { url } from '@dr.pogodin/react-utils';
```
URL utils.

- `url.parent(url)` &rArr; `string`

  Given an URL, returns the parent URL.

  Namely, this function trims any `/` symbols at the given `url` end, then cuts
  out the last path segment of the result. The exact logic might be enhanced
  later. The overall intent is: if you have the current URL, and need the URL
  for going one level up, calling `url.parent(url)` will give you that.

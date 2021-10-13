# url
```jsx
import { url } from '@dr.pogodin/react-utils';
```
Utilities for URL manipulations.

**Functions**
- [parent()](#parent) - Returns the parent URL of the given one.

## Functions

### parent()
```jsx
url.parent(url): string
```
Returns the parent URL of the given one.

Namely, this function trims any `/` symbols in the end of the given `url`,
then cuts out the last path segment. The exact logic might be enhanced later.
The overall intent is: for a given URL it returns the correct URL for going
one level up in the path tree.

**Arguments & Result**
- `url` - **string** - Input URL.
- Returns **string** - Parent URL.

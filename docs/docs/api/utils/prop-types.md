---
sidebar_class_name: deprecated
---

# PT (Prop Types)
:::danger Deprecated
The [PT] export (`prop-types` alias) was removed in the library **v1.36.0**,
as [`propTypes` checks are ignored by React v19+](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-proptypes-and-defaultprops).
Migrate to TypeScript, or alternative type-checking solutions.
:::

# Original Documentation
_Valid for library versions prior to **v1.36.0**_

```jsx
import { PT } from '@dr.pogodin/react-utils';
```
The [PT] module is just an alias for
[prop-types](https://www.npmjs.com/package/prop-types) library,
which facilitates runtime type checks for React.

[PT]: /docs/api/utils/prop-types

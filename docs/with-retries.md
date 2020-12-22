# withRetries(action, maxRetries = 5, interval = 1000)

```jsx
import { withRetries } from '@dr.pogodin/react-utils';
```

The `withRetries(action, maxRetries = 5, interval = 1000)` method executes
provided async `action` method up to the first success, or in case of failures
(if the method rejects/throws) it keeps re-tries it up to `maxRetries` with
the given `interval`.

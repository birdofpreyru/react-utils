# withRetries()
```jsx
import { withRetries } from '@dr.pogodin/react-utils';

withRetries(action, maxRetries = 5, interval = 1000): Promise
```
Attempts to perform the given asynchronous `action` up to `maxRetries` times,
with the given `interval` [ms] between attempts. If an attempt is successful
the output **Promise** is immediately resolved to the `action` result, and
the function exits without further attempts. If all allowed attempts failed
the output **Promise** rejects with the error capture in the last attempt.

**Arguments & Result**
- `action` - **function** - An asynchronous operation.
- `maxRetries = 5` - **number** - Optional. Maximum number of attempts.
  Defaults `5`.
- `interval = 1000` - **number** - Optional The interval between attempts
  in milliseconds. Defaults `1000` (1s).
- Returns **Promise** - Resolves to the result of the first successful attempt
  (without any further attempts after the success); or rejects with the error
  thrown from the last allowed, and failed attempt.

**Example**
```jsx
import { withRetries } from '@dr.pogodin/react-utils';

let firstCall = true;

function sampleAction() {
  if (!firstCall) return 'success';
  firstCall = false;
  throw Error('The first call to this function fails (throws)');
}

withRetries(sampleAction).then(console.log);

// After 1s delay it prints: "success".
```

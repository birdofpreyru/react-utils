# withRetries()
```jsx
import { withRetries } from '@dr.pogodin/react-utils';

function withRetries(action, maxRetries = 3, interval = 300): Promise
```
Attempts to perform the given asynchronous `action` up to `maxRetries` times,
with the given `interval` [ms] between attempts. If an attempt is successful
the function resolves to its result right away. If all allowed attempts failed
the function rejects with the error thrown from the last attempt.

:::info
The [withRetries()] source code has been moved to [JS Utils] library, and it is
re-exported from there; thus it also can be imported just as
```ts
import { withRetries } from '@dr.pogodin/js-utils';
```
:::

<details>
<summary>Example</summary>
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
</details>

### Arguments & Result
- `action` &mdash; **function** &mdash; An asynchronous operation to attempt.
  Can be a synchronous function as well.
- `maxRetries` &mdash; **number** &mdash; Optional. Maximum number of attempts.
  Defaults `3`.
- `interval` &mdash; **number** &mdash; Optional. The interval between attempts
  in milliseconds. Defaults `300` (~1/3 s).
- Resolves to the result of the first successful action attempt
  (without any further attempts after the success); or rejects with the error
  thrown from the last allowed, and failed attempt.

<!-- References -->
[JS Utils]: https://www.npmjs.com/package/@dr.pogodin/js-utils
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[withRetries()]: /docs/api/functions/withretries

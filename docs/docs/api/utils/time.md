# time
```jsx
import { time } from '@dr.pogodin/react-utils';
```
Date & time utilities. The `time` export itself is an alias for
[dayjs](https://day.js.org/en) library, to which the following
additional constants and functions are attached.

**Constants**
- [DAY_MS](#day_ms) - One day expressed in milliseconds.
- [HOUR_MS](#hour_ms) - One hour expressed in milliseconds.
- [MIN_MS](#min_ms) - One minute expressed in milliseconds.
- [SEC_MS](#sec_ms) - One second expressed in milliseconds.
- [YEAR_MS](#year_ms) - One year expressed in milliseconds.

**Functions**
- [now()](#now) - Returns current Unix timestamp in milliseconds.
- [timer()](#timer) - Creates a [Barrier] which resolves after the specified
  timeout. The timer can be aborted by **.abort()** method attached to
  the [Barrier].

## Constants

### DAY_MS
```jsx
time.DAY_MS: number = 24 * time.HOUR_MS
```
One day expressed in milliseconds. Equals `24 * time.DAY_MS`.

### HOUR_MS
```jsx
time.HOUR_MS: number = 60 * time.MIN_MS
```
One hour expressed in milliseconds. Equals `60 * time.MIN_MS`.

### MIN_MS
```jsx
time.MIN_MS: number = 60 * time.SEC_MS
```
One minute expressed in milliseconds. Equals `60 * time.SEC_MS`.

### SEC_MS
```jsx
time.SEC_MS: number = 1000
```
One second expressed in milliseconds. Equals `1000`.

### YEAR_MS
```jsx
time.YEAR_MS: number = 365 * time.DAY_MS
```
One year expressed in milliseconds. Equals `365 * time.DAY_MS`, thus a regular,
non-leap year.

## Functions

### now()
```jsx
time.now(): number
```
Returns the current Unix timestamp in milliseconds, thus just an alias for
[Date.now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now).

### timer()
```jsx
time.timer(timeout): Barrier
```
Creates a [Barrier] which resolves after the specified `timeout`. Additional
**.abort()** method is attached to the returned [Barrier], and it allows to
cancel the timer, without resolving nor rejecting the barrier (if needed,
it can be done by explicitly calling the standard [.resolve()] or [.reject()]
methods of the [Barrier] after aborting the timer).

**Arguments & Result**
- `timeout` - **number** - Timeout in milliseconds. If a non-positive value is
  passed in, the operation is noop (returns immediately resolved [Barrier]).
- Returns [Barrier] which resolves after the given `timeout`. Additional
  **.abort()** method is attached to the [Barrier], as explained above.

<!-- links -->
[Barrier]: /docs/api/classes/Barrier
[.resolve()]: /docs/api/classes/Barrier#resolve
[.reject()]: http://localhost:3000/docs/react-utils/docs/api/classes/Barrier#reject

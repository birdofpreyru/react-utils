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

**Hooks**
- [useCurrent()] - Returns the current timestamp pre-cached in the global state,
  thus wrapping [Date.now()] in an SSR-friendly way.
- [useTimezoneOffset()] - Returns the client-side (user) timezone offset
  in an SSR-friendly way.

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

## Hooks

### useCurrent()
```jsx
time.useCurrent(options): number
```
Returns the current time (Unix timestamp in milliseconds, _i.e._ [Date.now()]
result), pre-cached in the global state, thus ensuring all parts of the app
dependent on this hook get the same value within the render, and it also
matches between the server-side render and client-side hydration.

:::tip Example
This trivial component renders the current time, and when used alongside SSR
it would break client-side hydration if [Date.now()] was used directly instead
of [useCurrent()] hook:
```jsx
import { time } from '@dr.pogodin/react-utils';

export default function CurrentTime() {

  // const timestamp = Date.now(); // would cause issues with SSR.
  const timestamp = time.useCurrent();

  return <div>Current timestamp is: {timestamp}</div>;
}
```
:::

At the server-side only the first call to this hook within the render actually
retrieves the current time from [Date.now()], and stores it in the global state.
All subsequent calls to the hook (including from different components, and from
subsequent SSR rounds) serve the same value stored in the global state.

At the client-side the calls to this hook also return the value from the global
state (thus, initially matching the one used in SSR), and they also schedule a
later update of this value in the global state with a finite precision.
By default, the update happens once after a component calling the hook has
mounted, and if [Date.now()] result at the moment of update differs from
the timestamp stored in the global state more than requested precision
(5 seconds, by default), the value in the global state is updated, thus
triggering rerender of all components using this hook, or directly watching
updated segment of the global state. The caller may also opt for automatic
periodic update of the value returned by the hook (beware, as the value is
managed through the global state, it will potentially re-render entire app
on each update).

**Arguments & Result**
- `options` - **object** - Optional. Custom settings, overriding default values
  listed below.
  - `autorefresh` - **boolean** - Optional. Set this **true** and the hook will
    automatically refresh the current timestamp stored in the global state with
    the period set by `precision` option below. Beware, as this will trigger
    potential re-renders of other components watching affected segment of
    the global state. Defaults **false**.
  - `globalStatePath` - **string** - Optional. The global state path where
    the current timestamp value will be stored. Different hooks pointing to
    different global state paths will work completely independently.
    Defaults to "_currentTime_".
  - `precision` - **number** - Optional. Required result precision
    in milliseconds. On each attempt to update the current timestamp,
    the hook will only modify the value stored in the global state (and thus
    the hook result) if [Date.now()] result differs from the current value
    at `globalStatePath` by more than this `precision`. This effectively
    sets as well the period of automatic timestamp updates if opted by
    `autorefresh` option. Defaults _5 &times; [SEC_MS]_ (5 seconds).

- Returns **number** - Unix timestamp in milliseconds, equal to the current time
  with a finite `precision` (see options above).

### useTimezoneOffset()
```jsx
time.useTimezoneOffset(options): number
```
Returns **client**'s timezone offset in an SSR-friendly way. The timezone offset
is defined as the difference in milliseconds between a timestamp in the user's
timezone, and the standard timestamp for the same moment (thus, UTC time). Thus,
adding this offset to the standard Unix timestamp will give the time in user's
timezone.

:::caution
Notice, the timezone offset definition we use is different from the one used by
the standard **Date**'s
[getTimezoneOffset()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
method, which returns the result in minutes, and calculates it as the difference
between UTC and the user's timezone (vice-versa compared to our difference).
:::

Under the hood, in the first render, both at the server and client side, this
hook returns zero value. Then, at the client side, it determines the actual
timezone offset, returning it going forward, and also setting it to a cookie,
thus allowing to use that actual value in the further server-side renders for
that user.

:::tip Example
For better understanding of this example, keep in mind that by default
[dayjs](https://day.js.org) (aliased as **time** by this library) parses
and displays time in the local timezone, which is apparently different for
server and client, in general case. To correctly handle it within SSR,
we need to specify the correct timezone, UTC in this example.

```jsx
// UTC support by DayJS (time) must be explicitly enabled.
import UTC from 'dayjs/plugin/utc';

import { time } from '@dr.pogodin/react-utils';

// Enables UTC support. It is safe to call it multiple times in different parts
// of code, DayJS does the check that the plugin should be installed only once.
time.extend(UTC);

export default function Example() {
  // This is Unix timestamp (thus, UTC time), retrieved in SSR-friendly way.
  const now = time.useCurrent();

  // This is the time difference between user timezone and UTC.
  const offset = time.useTimezoneOffset();

  // This is current time in UTC timezone in human-readable HH:mm format.
  const utcTime = time.utc(now).format('HH:mm');

  // This is current time in the local (user) timezone in human-readable HH:mm
  // format. Technically, we use parsing and formatting in UTC zone, but adding
  // the offset to our timestamp shifts the result by the correct amount to get
  // the result in the user's timezone.
  const localTime = time.utc(now + offset).format('HH:mm');

  return (
    <div>
      <div>UTC time: {utcTime}</div>
      <div>Local time: {localTime}</div>
    </div>
  );
}
```
:::

**Arguments & Result**
- `options` - **object** - Optional settings.
  - `cookieName` - **string** - Optional. The name of cookie to use to store
    and pass the user's timezone to the server side. If set to a falsy value,
    the hook won't use cookie at all, always returning zero at the server-side,
    and in the first render at the client side. Defaults to "`timezoneOffset`".
- Returns **number** - the timezone offset in milliseconds.

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
[Date.now()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
[.resolve()]: /docs/api/classes/Barrier#resolve
[.reject()]: http://localhost:3000/docs/react-utils/docs/api/classes/Barrier#reject
[SEC_MS]: #sec_ms
[useCurrent()]: #usecurrent
[useTimezoneOffset()]: #usetimezoneoffset

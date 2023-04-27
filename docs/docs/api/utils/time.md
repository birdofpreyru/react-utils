# time
```jsx
import { time } from '@dr.pogodin/react-utils';
```
Date & time utilities. The `time` export itself is an alias for
[dayjs] library, to which the following additional constants and functions
are attached.

:::info
Non-React-specific additions to  [dayjs] library, attached as fields and methods
to the exported `time` object, are now moved as stand-alone entities into
[JS Utils] library, imported, and re-used from there. Thus, in addition to
still being fields and methods of `time`, the following constants and methods
can be also imported from [JS Utils] directly:

```js
import {
  SEC_MS,
  MIN_MS,
  HOUR_MS,
  DAY_MS,
  YEAR_MS,
  timer,

  // Also there is a new Timer class, which is a new implementation behind
  // timer() method, and is exposed to allow further extending it for more
  // advanced scenarios.
  Timer,
} from '@dr.pogodin/js-utils';
```
:::

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

<details>
<summary>Example</summary>

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
</details>

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
Wraps the standard [Date.getTimezoneOffset()] method (_returns the difference,
in minutes, between a date as evaluated in the UTC time zone, and the same date
as evaluated in the local time zone_) in a SSR-friendly way.

Within SSR context, the timezone of server, in general, is different from
the user's timezone, thus a direct call to [Date.getTimezoneOffset()] would
return different values at the client and server side, thus potentially breaking
SSR. This hook will call [Date.getTimezoneOffset()] only at the client side,
thus getting the user's timezone, and it will use a cookie to pass that offset
to the server with subsequent user requests. If the cookie is present,
the server will use its value as the offset, otherwise falling back to a zero
offset. Whatever the value is used at the server side, it is also stored in
the global state and thus passed to the client side ensuring the initial client
side render will always match the server render. Once the hook is evaluated
at the client side it will retrieve (update) the timezone, if needed.

**Arguments & Result**
- `options`: **object** &mdash; Optional settings.
  - `cookieName`: **string** &mdash; Optional. The name of cookie to use to store
    and pass the user's timezone to the server side. If set to a falsy value,
    the hook won't use cookie at all, always returning zero at the server-side,
    and in the first render at the client side. Defaults to "`timezoneOffset`".
  - `globalStatePath`: **string** &mdash; Optional. The global state path where
    the timezone offset value will be stored. Defaults to "`timezoneOffset`".
- Returns **number** &mdash; The difference, in minutes, between a date as evaluated
  in the UTC time zone, and the same date as evaluated in the user's (client)
  local time zone.

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
[dayjs]: https://day.js.org/en
[Date.now()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
[JS Utils]: https://www.npmjs.com/package/@dr.pogodin/js-utils
[.resolve()]: /docs/api/classes/Barrier#resolve
[.reject()]: http://localhost:3000/docs/react-utils/docs/api/classes/Barrier#reject
[SEC_MS]: #sec_ms
[useCurrent()]: #usecurrent
[useTimezoneOffset()]: #usetimezoneoffset
[Date.getTimezoneOffset()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset

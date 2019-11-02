# Date & Time Utilities

```js
import { time } from '@dr.pogodin/react-utils';
```
Date & time utils. `time` is an alias for the [moment](https://momentjs.com/docs/) library, i.e. you can use `time()` the same way you would use `moment()`. Also
`time` has the following extra stuff attached.

### Constants

Some time intervals expressed in milliseconds:
- `time.SEC_MS`
- `time.MIN_MS`
- `time.HOUR_MS`
- `time.DAY_MS`
- `time.YEAR_MS`

### Functions

- `time.now()`

  Alias for `Date.now()` &ndash; returns current time in [ms].

- `time.timer(timeout)` &rArr; `Promise`
  
  Waits for the `timeout` interval, specified as a number [ms].
  Returns a promise which resolves once the time has passed.

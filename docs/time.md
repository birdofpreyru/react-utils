```js
import { time } from '@dr.pogodin/react-utils';
```
Date & time constants and utilities, not found in
the [moment](https://momentjs.com/docs/) library, and the standard
[JS Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

### Constants

Some time intervals expressed in milliseconds:
- `time.SEC_MS`
- `time.MIN_MS`
- `time.HOUR_MS`
- `time.DAY_MS`
- `time.YEAR_MS`


### Functions

- `time.timer(timeout)` &rArr; `Promise`
  
  Waits for the `timeout` interval, specified as a number [ms].
  Returns a promise which resolves once the time has passed.

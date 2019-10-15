<a name="module_time"></a>

## time
```js
import { time } from '@dr.pogodin/react-utils';
```
Date & time utilities.

In most cases you will rely on JS
[`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date),
and [`moment`](https://momentjs.com/docs/) library for your date & time
operations. This module provides a few date & time related things not covered
by `Date` and `moment`.


* [time](#module_time)
    * [.SEC_MS](#module_time.SEC_MS)
    * [.MIN_MS](#module_time.MIN_MS)
    * [.HOUR_MS](#module_time.HOUR_MS)
    * [.DAY_MS](#module_time.DAY_MS)
    * [.YEAR_MS](#module_time.YEAR_MS)
    * [.timer(timeout)](#module_time.timer) ⇒ <code>Promise</code>

<a name="module_time.SEC_MS"></a>

### time.SEC\_MS
One second value [ms].

**Kind**: static constant of [<code>time</code>](#module_time)  
<a name="module_time.MIN_MS"></a>

### time.MIN\_MS
One minute value [ms].

**Kind**: static constant of [<code>time</code>](#module_time)  
<a name="module_time.HOUR_MS"></a>

### time.HOUR\_MS
One hour value [ms].

**Kind**: static constant of [<code>time</code>](#module_time)  
<a name="module_time.DAY_MS"></a>

### time.DAY\_MS
One day value [ms].

**Kind**: static constant of [<code>time</code>](#module_time)  
<a name="module_time.YEAR_MS"></a>

### time.YEAR\_MS
One year value [ms].

**Kind**: static constant of [<code>time</code>](#module_time)  
<a name="module_time.timer"></a>

### time.timer(timeout) ⇒ <code>Promise</code>
Waits for the specified time.

**Kind**: static method of [<code>time</code>](#module_time)  
**Returns**: <code>Promise</code> - Resolves after the specified timeout.  

| Param | Type | Description |
| --- | --- | --- |
| timeout | <code>Number</code> | Interval duration [ms]. |


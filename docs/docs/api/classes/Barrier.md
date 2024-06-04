# Barrier
```jsx
import { Barrier } from '@dr.pogodin/react-utils'; // or from '@dr.pogodin/js-utils';
```
The [Barrier] class is just an auxiliary wrapper around [Promise] which has
its resolution and rejection functions attached as methods to the class instances.
It sometimes comes handy for synchronisation between different asynchronous
operations.

## Fields
- `.resolved` &mdash; **boolean** &mdash; Readonly. **true** once the barrier
  has been resolved; **false** before it.
- `.rejected` &mdash; **boolean** &mdash; Readonly. **true** once the barrier
  has been rejected; **false** before it.
- `.settled` &mdash; **boolean** &mdash; Readonly. **true** once the barrier has
  been resolved or rejected; **false** otherwise.

## Methods
- [constructor()] - Creates a new [Barrier].
- [catch()] - Similar to a [**Promise** catch()].
- [finally()] - Similar to a [**Promise** finally()].
- [resolve()] - Resolves the barrier.
- [reject()] - Rejects the barrier.
- [then()] - Similar to a [**Promise** then()].

### constructor()
```jsx
const barrier = new Barrier(executor);
```
Creates a new [Barrier].

**Arguments**
- `executor` - **function** - Optional. When provided, it will be called
  with `resolve` and `reject` arguments as the usual
  [**Promise** constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise) does. As [Barrier] instances have
  [resolve()] and [reject()] methods attached, the executor is not necessarily
  required.

### catch()
```jsx
barrier.catch(onRejection): Barrier;
```
Similar to the standard [**Promise** catch()],
but returns a [Barrier] which [resolve()] and [reject()] methods act on
the original `barrier`.

### finally()
```jsx
barrier.finally(onFinally): Barrier;
```
Similar to the standard [**Promise** finally()],
but returns a [Barrier] which [resolve()] and [reject()] methods act on
the original `barrier`.

### resolve()
```jsx
barrier.resolve(value): Barrier;
```
Resolves the barrier with the optional `value`, similar to how the standard
[Promise] resolves. To allow chaining, it returns this barrier instance.

### reject()
```jsx
barrier.reject(value): Barrier;
```
Rejects the barrier with the optional `value`, similar to how the standard
[Promise] rejects. To allow chaining, it returns this barrier instance.

### then()
```jsx
barrier.then(onResolved, onRejected): Barrier;
```
Similar to the standard [**Promise** then()],
but returns a [Barrier] which [resolve()] and [reject()] methods act on
the original `barrier`.

[Barrier]: /docs/api/classes/Barrier
[JS Utils]: https://www.npmjs.com/package/@dr.pogodin/js-utils
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[**Promise** catch()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
[**Promise** finally()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
[**Promise** then()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
[constructor()]: #constructor
[catch()]: #catch
[finally()]: #finally
[resolve()]: #resolve
[reject()]: #reject
[then()]: #then

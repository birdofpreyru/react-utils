# Redux Utils

```jsx
import { redux } from '@dr.pogodin/react-utils';
```

`redux` provides [Redux](https://redux.js.org/)-related utilities. They help
to manage a central data store in a web app.

### Content

- [`redux.connect(..)`](#redux-connect)
- [`redux.createActions(..)`](#redux-create-actions)
- [`redux.handleActions(..)`](#redux-handle-actions)
- [`redux.combineReducers(..)`](#redux-combine-reducers)
- [`redux.proxyAction(..)`](#redux-proxy-action)
- [`redux.proxyReducer(..)`](#redux-proxy-reducer)
- [`redux.resolveAction(..)`](#redux-resolve-action)
- [`redux.resolveReducers(..)`](#redux-resolve-reducers)
- [`redux.storeFactory(..)`](#redux-store-factory)

### Reference

- <a name="redux-connect"></a>
  `redux.connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`
  &rArr; `Function`

  Connects a React component to a Redux store.
  Alias of [`connect` from `react-redux`](https://react-redux.js.org/api/connect).

- <a name="redux-create-actions"></a>
  `redux.createActions(actionMap, [...identityActions], [options])` &rArr;
  `Object`

  Creates an object mapping action types to action creators.
  Alias of
  [`createActions` from `redux-actions`](https://redux-actions.js.org/api/createaction#createactions).

- <a name="redux-handle-actions"></a>
  `redux.handleActions(reducerMap, defaultState)` &rArr; `Reducer`

  Creates, and combines multiple reducers into a single reducer that handles
  multiple actions.
  Alias of
  [`handleActions` from `redux-actions`](https://redux-actions.js.org/api/handleaction#handleactions).

- <a name="redux-combine-reducers"></a>
`redux.combineReducers(...reducers)` &rArr; `Reducer`

  Combines mutliple reducers into a single reducer. Each reducer can be a reducer
  function, or a reducer map. Reducer functions will be called with the current
  state, and reducers from a map will be called with the corresponding state
  slice.

  Note, this is similar to, but different from `redux.handleActions(..)`, and
  [`combineReducers(..)` from `redux`](https://redux.js.org/api/combinereducers),
  because it also allows to mix together reducers operating at the same state
  level.

- <a name="redux-proxy-action"></a>
  `redux.proxyAction(actionCreator, [action])` &rArr; `Function` or `Action`

  Creates proxy action and payload creators. This helps to use library actions
  and reducers inside your own actions and reducers.

  1.  If no `action` argument is provided, it generates, and returns payload
      creator for the given `actionCreator`, i.e. just
      ```js
      (...args) => actionCreator(...args).payload
      ```

      The purpose is: if you are given a map of actions, created by
      `redux.createActions(..)`, and you want to reuse some of those
      actions with original logic, but different action types, you can do
      with this function:
      ```js
      import { libraryActions } from 'some/library';

      const myActions = redux.createActions({
        MY_STATE_SEGMENT: {
          MY_ACTION: redux.proxyAction(libraryActions.usefulAction),
        },
      });
      ```
      In result the action `myActions.myStateSegment.myAction` has type
      `MY_STATE_SEGMENT/MY_ACTION`, but it operates its state segment with
      following the logic from original `usefulAction` provided by a library.

  2.  If `action` argument is provided, this function creates its copy with
      the type taken from `actionCreator`, i.e. it returns

      ```js
      const result = { ...action, type: actionCreator.toString() };
      ```

      The purpose is: if you have created a proxy action, following (i), and
      you have the reducer for the `usefulAction`, you can rely on that reducer
      in your own reducer for `myAction`, e.g.:

      ```js
      import { libraryActions, libraryReducers } from 'some/library';

      /* Your reducer for `MY_STATE_SEGMENT/MY_ACTION` */
      function onMyAction(state, action) {
        if (action.error) {
          /* Your custom error-processing. */
          return newState;
        }

        /* All good to call the library reducer. */
        const a = redux.proxyAction(libraryActions.usefulAction, action);
        return libraryReducers.usefulReducer(state, a);

        /* The same logic can be written as:
         *
         *  const r = redux.proxyReducer(
         *    libraryReducers.usefulReducer,
         *    libraryActions.usefulAction,
         *  );
         *  return r(state, action);
         *
         * But relying on `redux.proxyAction(..)` and the original library
         * reducer is somewhat more efficient under the hood.
         */
      }
      ```

- <a name="redux-proxy-reducer"></a>
  `redux.proxyReducer(reducer, actionCreator)` &rArr; `Reducer`

  Creates a proxy reducer:
  ```js
  (state, action) => reducer(state, redux.proxyAction(actionCreator, action))
  ```

  The purpose is, in the example above, if you don't need to add a custom logic
  to the library-provided reducer you rely on, instead of writing your custom
  reducer as
  ```js
  import { libraryAction, libraryReducers } from 'some/library';

  function onMyAction(state, action) {
    const a = redux.proxyAction(libraryActions.usefulAction, action);
    return libraryReducers.usefulReducer(state, a);
  }
  ```
  You can go with shorter, and more readable syntax:

  ```js
  import { libraryAction, libraryReducers } from 'some/library';

  const onMyAction = redux.proxyReducer(
    libraryReducers.usefulReducer,
    libraryActions.usefulAction,
  );
  ```

- `async resolveAction(action)` &rArr; `Promise` &rArr; `Object`

  Given any [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action)
  (FSA), with a promise as payload, it returns a promise which resolves into
  the FSA result object.

  In other words, it does a job similar to
  [redux-promise-middleware](https://www.npmjs.com/package/redux-promise-middleware),
  but without Redux, and dispatching. It is useful for server-side rendering
  purposes.

- <a name="redux-resolve-reducers"></a>
  `async redux.resolveReducers(promiseMap)` &rArr; `Promise` &rArr; `ReducerMap`

  Given a map of promises that resolve to reducers, it returns a promise
  which resolves to the map of resulting reducers.

- <a name="redux-store-factory"></a>
  `async redux.storeFactory(getReducerFactory, [httpRequest], [initialState], [moduleHot], [reducerFactoryModulePath])` &rArr; `Promise` &rArr; `ReduxStore`

  Creates a new Redux store.

  **Arguments**

  - `getReducerFactory` (_Function_) &ndash; Function which returns reducer
    factory. For HMR to work, it should require the JS module of the factory
    each time it is called.

  - `httpRequest` (_Object_) &ndash; Optional. Incoming ExpressJS HTTP request.
    It should be passed in if the store is created at server side, and server
    side rendering is supported.

  - `initialState` (_Object_) &ndash; Optional. Initial Redux state. It should
    be passed in at the client side to support server-side rendering (in which
    case it is the initial Redux state deduced for the request at the server
    side and passed in to the client along with the bundle, and pre-rendered
    HTML markup).

  - `moduleHot` (_Object_) &ndash; Optional. `module.hot` object of the module
    whcih imports `storeFactory(..)`. If passed in, `storeFactory(..)` will
    setup HMR of the reducers.

  - `reducerFactoryModulePath` (_String_) &ndash; Optional. Path of the root
    module of the reducer factory. It is necessary to set up HMR support.

  **Returns** promise resolving to the created Redux store.

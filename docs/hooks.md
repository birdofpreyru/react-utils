# Hooks

```jsx
import { hooks } from '@dr.pogodin/react-utils';

const {
  /* Hooks from @dr.pogodin/react-utils */
  useAsyncData,
  useGlobalState,

  /* Standard React hooks. */
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
} = hooks;
```

`useAsyncData(..)` and `useGlobalState(..)` are aliases of the same named hooks
from [`@dr.pogodin/react-global-state`](https://www.npmjs.com/package/@dr.pogodin/react-global-state).

`useState(..)`,
`useEffect(..)`,
`useContext(..)`,
`useReducer(..)`,
`useCallback(..)`,
`useMemo(..)`,
`useRef(..)`,
`useImperativeHandle(..)`,
`useLayoutEffect(..)`, and
`useDebugValue(..)` are aliases of the standard React hooks.

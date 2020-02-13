/**
 * React hooks.
 */

import { useGlobalState, useAsyncData } from '@dr.pogodin/react-global-state';
import {
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
} from 'react';

export default {
  /* These are hooks from `@dr.pogodin/react-global-state`. */
  useAsyncData,
  useGlobalState,

  /* These are the standard React hooks, aliased for convenience. */
  useState,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
};

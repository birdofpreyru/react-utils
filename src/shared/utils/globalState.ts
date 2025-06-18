import type { Request } from 'express';

import { type SsrContext, withGlobalStateType } from '@dr.pogodin/react-global-state';

/** Mapping "chunkName" > array of asset paths. */
export type ChunkGroupsT = Record<string, string[]>;

// The type of data object injected by server into generated markup.
export type InjT = {
  CHUNK_GROUPS?: ChunkGroupsT;
  CONFIG?: Record<string, unknown>;
  ISTATE?: unknown;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    REACT_UTILS_INJECTION?: InjT;
  }
}

// TODO: Not 100% sure now, whether it indeed can be replaced by type,
// or do we really need it to be an interface. Keeping the interface for now.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface SsrContextT<StateT> extends SsrContext<StateT> {
  chunkGroups: ChunkGroupsT;
  chunks: string[];

  /** If set at the end of SSR, the rendered will trigger
   *  server-side redirect to this URL (and use the status
   *  code). */
  redirectTo?: string;

  req: Request;
  status: number;
}

const {
  getSsrContext,
} = withGlobalStateType<unknown, SsrContextT<unknown>>();

export {
  getSsrContext,
};

import { type Request } from 'express';

import { type SsrContext, withGlobalStateType } from '@dr.pogodin/react-global-state';

export type ChunkGroupsT = {
  [chunkName: string]: string[];
};

// The type of data object injected by server into generated markup.
export type InjT = {
  CHUNK_GROUPS?: ChunkGroupsT;
  CONFIG?: { [key: string]: any },
  ISTATE?: unknown;
};

export type SsrContextT<StateT> = SsrContext<StateT> & {
  chunkGroups: ChunkGroupsT;
  chunks: string[];
  req: Request,
  status: number;
};

const {
  getSsrContext,
} = withGlobalStateType<unknown, SsrContextT<unknown>>();

export {
  getSsrContext,
};

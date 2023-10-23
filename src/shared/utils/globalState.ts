import type { Request } from 'express';

import RGS, { type API, type SsrContext } from '@dr.pogodin/react-global-state';

export type ChunkGroupsT = {
  [chunkName: string]: string[];
};

// The type of data object injected by server into generated markup.
export type InjT = {
  CHUNK_GROUPS?: ChunkGroupsT;
  CONFIG?: { [key: string]: any },
  ISTATE?: unknown;
};

export interface SsrContextT<StateT> extends SsrContext<StateT> {
  chunkGroups: ChunkGroupsT;
  chunks: string[];
  req: Request,
  status: number;
}

const {
  getSsrContext,
} = (RGS as unknown) as API<unknown, SsrContextT<unknown>>;

export {
  getSsrContext,
};

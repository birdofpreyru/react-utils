import { registerResolver } from 'server/utils/modules';

registerResolver();

// eslint-disable-next-line import/dynamic-import-chunkname
void import('./ssr');

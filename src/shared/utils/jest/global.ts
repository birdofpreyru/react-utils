import type { IFs } from 'memfs';
import type { Configuration, StatsCompilation } from 'webpack';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    ssrMarkup: string | undefined;
    ssrStatus: number | undefined;
    webpackConfig: Configuration | undefined;
    webpackOutputFs: IFs;
    webpackStats?: StatsCompilation;
  }
}

export default function getGlobal(): Window {
  return global as unknown as Window;
}

import { type IFs } from 'memfs';

/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
/* eslint-enable import/no-extraneous-dependencies */

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    ssrMarkup: string | undefined;
    ssrStatus: number | undefined;
    webpackConfig: webpack.Configuration | undefined;
    webpackOutputFs: IFs;
    webpackStats?: webpack.StatsCompilation;
  }
}

export default function getGlobal(): Window {
  return global as unknown as Window;
}

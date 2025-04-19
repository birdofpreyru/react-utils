
/* eslint-disable import/no-extraneous-dependencies */

import { clone, defaults } from 'lodash';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import webpack, { type Configuration } from 'webpack';
import { merge } from 'webpack-merge';

import baseFactory, { type OptionsT as BaseOptionsT } from './app-base';

type OptionsT = BaseOptionsT & {
  dontUseHmr?: boolean;
  dontUseReactGlobalStateDebugging?: boolean;
  cssExtractionOptions?: MiniCssExtractPlugin.PluginOptions;
};

/**
 * @param ops
 * @param [ops.dontUseReactGlobalStateDebugging]
 * @param [ops.dontUseHmr]
 */
export default function configFactory(ops: OptionsT): Configuration {
  const o = defaults(clone(ops), {
    cssLocalIdent: '[package]___[path][name]___[local]___[hash:base64:6]',
  });

  const entry = ['@dr.pogodin/react-utils/build/development/client/init'];
  if (!o.dontUseHmr) entry.push('webpack-hot-middleware/client?reload=true');
  entry.push(...Array.isArray(o.entry) ? o.entry : [o.entry]);

  const plugins: webpack.WebpackPluginInstance[] = [
    new MiniCssExtractPlugin({
      chunkFilename: '[id].css',
      filename: '[id].css',
      ...ops.cssExtractionOptions,
    }),
    new webpack.DefinePlugin({
      'process.env.BABEL_ENV': JSON.stringify('development'),
      'process.env.DEV_TOOLS': JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.REACT_GLOBAL_STATE_DEBUG':
        JSON.stringify(!o.dontUseReactGlobalStateDebugging),
    }),
  ];

  // TODO: There should be no reason to include these plugins when HMR is opted
  // out, however if I remove them, the compilation fails with obscure
  // "ReferenceError: $RefreshReg$ is not defined" error. For now it seems
  // fine to keep these plugins anyway, thus the shortcut of "if" condition
  // below.
  // if (true ?? !o.dontUseHmr) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin({
      overlay: {
        sockIntegration: 'whm',
      },
    }),
  );
  // }

  const res = merge(baseFactory({
    ...o,
    babelEnv: 'development',
    entry,
    mode: 'development',
  }), {
    output: {
      chunkFilename: '[id].js',
      filename: '[id].js',
    },
    plugins,
    snapshot: {
      // This enforces Webpack to watch for possible changes in node_modules
      // dependencies, which is a great convenience in library-centric dev
      // workflows.
      managedPaths: [],
    },
  });

  return res;
}

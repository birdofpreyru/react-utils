// Development Webpack config for ReactJS libraries.

/* eslint-disable import/no-extraneous-dependencies */

import path from 'node:path';

import webpack from 'webpack';
import { merge } from 'webpack-merge';

import baseFactory, { type OptionsT as BaseOptionsT } from './lib-base';

type OptionsT = BaseOptionsT;

export default function configFactory(ops: OptionsT): webpack.Configuration {
  const { outputPath = 'build/development' } = ops;

  return merge(
    baseFactory({
      ...ops,
      babelEnv: 'development',
      cssLocalIdent: '[package]___[path][name]___[local]___[hash:base64:6]',
      mode: 'development',
      outputPath: path.resolve(__dirname, ops.context, outputPath),
    }),
    {
      plugins: [
        new webpack.DefinePlugin({
          // Dev. build of the library wraps modules inside eval() statements,
          // hiding BUILD_INFO literals from the host code's Webpack build, thus
          // leaving them undefined. As a work around, let's get it via global
          // window object.
          BUILD_INFO: 'window.__DEV_BUILD_INFO__',

          'process.env.BABEL_ENV': JSON.stringify('development'),
          'process.env.NODE_ENV': JSON.stringify('development'),
          'process.env.REACT_GLOBAL_STATE_DEBUG': JSON.stringify(true),
        }),
      ],
      snapshot: {
        // This enforces Webpack to watch for possible changes in node_modules
        // dependencies, which is a great convenience in library-centric dev
        // workflows.
        managedPaths: [],
      },
    },
  );
}

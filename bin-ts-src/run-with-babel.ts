#!/usr/bin/env node

// As of Babel v8, it looks that @babel/node does not quite work with ES module
// codebase. This simple script effectively implements the base @babel/node
// functionality relying on the Node's "module customization hooks"
// (release candidate API, as of Node v24), see:
// https://nodejs.org/docs/latest-v24.x/api/module.html#customization-hooks

import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import {
  registerBabelLoader,
  registerResolver,
} from '@dr.pogodin/react-utils/server';

const [,, script] = process.argv;
if (!script) throw Error('No script provided');

registerResolver();
registerBabelLoader();

const require = createRequire(import.meta.url);

// eslint-disable-next-line  import/no-dynamic-require
require(resolve(script));

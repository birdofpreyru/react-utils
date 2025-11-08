// Note: the standard Webpack config for apps automatically adds client/init
// to entrypoints as "@dr.pogodin/react-utils/build/production/client-init",
// i.e. including the package name, which does not work within the library
// tests. The easiest workaround is just to call it explictly here, when
// we need it.
// TODO: Can we improve this behavior, so it works out of the box within
// this library tests?

// eslint-disable-next-line import/no-unassigned-import
import 'client/init';

import { launchClient } from 'client';
import Scene from './Scene';

global.SCENE_INIT_PROMISE = launchClient(Scene);

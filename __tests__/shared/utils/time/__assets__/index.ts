// This is Scene for testing useCurrent() hook.

import client from 'client';
import Scene from './Scene';

global.SCENE_INIT_PROMISE = client(Scene);

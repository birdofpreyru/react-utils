import { launchClient } from 'client';
import Scene from './Scene';

global.SCENE_INIT_PROMISE = launchClient(Scene);

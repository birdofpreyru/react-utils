import { launchClient } from 'client';
import Scene from './SampleScene';

global.SCENE_INIT_PROMISE = launchClient(Scene);
